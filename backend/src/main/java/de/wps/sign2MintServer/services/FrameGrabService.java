package de.wps.sign2MintServer.services;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.lang.invoke.MethodHandles;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpClient.Redirect;
import java.net.http.HttpClient.Version;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

import javax.imageio.ImageIO;

import org.bytedeco.javacv.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;


@Service
public class FrameGrabService {

    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    private final int thumbnailHeight = 720;
    private final int thumbnailWidth = 1280;
    private final String thumbnailFormat = "png";

    private final HttpClient httpClient;
    private final String cachedThumbnailsPath;

    public FrameGrabService(CacheService cacheService) {

        cachedThumbnailsPath = cacheService.getCachedThumbnailsDirectoryPath();
        File file = new File(cachedThumbnailsPath);
        if (!file.exists()) {
            file.mkdir();
        }

        httpClient = HttpClient.newBuilder()
                .version(Version.HTTP_2)
                .followRedirects(Redirect.ALWAYS)
                .build();
    }

    public File getThumbnailForVideo(String videoUrl) {

        var thumbnailPath = getThumbnailPath(videoUrl);
        var videoThumbnail = new File(thumbnailPath);
        if (!videoThumbnail.exists()) {
            var thumbnailCreationSuccess = generateThumbnailFromVideo(videoUrl);

            if(!thumbnailCreationSuccess)
            {
                var message = String.format("Thumbnail could not be created for %s", videoUrl);
                LOGGER.info(message);
            }

            return thumbnailCreationSuccess ? videoThumbnail : null;
        }
        else
        {
            return videoThumbnail;
        }
    }

    private String getThumbnailPath(String videoUrl) {
        String[] splittedUrl = videoUrl.split("/");
        String[] splittedFilename = splittedUrl[splittedUrl.length - 1].split("\\.");
        String thumbnailName = splittedFilename[0];
        return cachedThumbnailsPath + "/" + thumbnailName + "_" + thumbnailWidth + "x" + thumbnailHeight + "." + thumbnailFormat;
    }

    @SuppressWarnings("resource")
	private boolean generateThumbnailFromVideo(String videoUrl) {
        File video = getVideoFileFromAPI(videoUrl);
        if (video == null || !video.exists())
            return false;

        try (FFmpegFrameGrabber frameGrabber = FFmpegFrameGrabber.createDefault(video)) {
            frameGrabber.setFormat("mp4");
            frameGrabber.setImageHeight(thumbnailHeight);
            frameGrabber.setImageWidth(thumbnailWidth);
            frameGrabber.start();
            frameGrabber.setTimestamp(frameGrabber.getLengthInTime() / 3);
            Frame frame = frameGrabber.grabImage();
            BufferedImage image = new Java2DFrameConverter().convert(frame);
            var thumbnailPath = getThumbnailPath(videoUrl);
            ImageIO.write(image, thumbnailFormat, new File(thumbnailPath));
            video.delete();
            image.flush();
            return true;

        } catch (IOException e) {
        	LOGGER.warn(e.getMessage());
            e.printStackTrace();
        }

        return false;
    }

    private File getVideoFileFromAPI(String videoUrl){

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(videoUrl))
                    .header("Content-Type", "video/mp4")
                    .timeout(Duration.ofMinutes(1))
                    .GET()
                    .build();

             return httpClient.send(request, HttpResponse.BodyHandlers.ofFile(File.createTempFile("tmp", "").toPath()))
                        .body()
                        .toFile();
        }
        catch (OutOfMemoryError e) {

            var runtime = Runtime.getRuntime();
            var totalMemory = runtime.totalMemory() / 1048576;
            var freeMemory = runtime.freeMemory() / 1048576;
            var usedMemory = totalMemory - freeMemory;

            var message = String.format("%s MB/%s MB (%s MB free)",usedMemory,totalMemory,freeMemory);
            LOGGER.warn(message);
            LOGGER.warn(e.getMessage());
            e.printStackTrace();
        }
        catch (Exception e) {
        	LOGGER.warn(e.getMessage());
            e.printStackTrace();
        }
        return null;
    }
}

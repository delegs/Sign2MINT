package de.wps.sign2MintServer.services;

import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
/*
  Verwaltet die Pfade der Caches, um sicherzustellen, dass unabhängig vom Startpunkt der
  Anwendung immer auf die gleiche Stelle gezeigt wird.
 */
public class CacheService {

    private final String basePath = new File("").getAbsolutePath();
    private final String backendPath = Path.of(basePath,"backend").toString();

    private static final String AIRTABLE_CACHE_FILENAME = "AirtableCache.json";
    private static final String LEXIKONEINTRAEGE_CACHE_FILENAME = "LexikoneintraegeCache.json";

    private final boolean runsFromProjectFolder;

    public CacheService() {
        runsFromProjectFolder = runsFromProjectFolder();
    }

    public String getAirtableCacheFilePath() {
        if(runsFromProjectFolder)
            return Path.of(backendPath, AIRTABLE_CACHE_FILENAME).toString();
        else
            return AIRTABLE_CACHE_FILENAME;
    }

    public String getLexikoneintraegeCacheFilePath() {
        if(runsFromProjectFolder)
            return Path.of(backendPath, LEXIKONEINTRAEGE_CACHE_FILENAME).toString();
        else
            return LEXIKONEINTRAEGE_CACHE_FILENAME;
    }

    public String getCachedThumbnailsDirectoryPath() {
        var directoryName = "cachedThumbnails";
        if(runsFromProjectFolder)
            return Path.of(backendPath, directoryName).toString();
        else
            return directoryName;
    }

    private boolean runsFromProjectFolder() {
        var baseDirectory = new File("").getAbsolutePath();
        try (var stream = Files.newDirectoryStream(Path.of(baseDirectory))) {
            for (var path : stream) {
                var absolutePath = path.toAbsolutePath().toString();
                if (absolutePath.endsWith("backend"))
                    return true;
            }
        } catch (IOException ignored) {
        }
        return false;
    }
}

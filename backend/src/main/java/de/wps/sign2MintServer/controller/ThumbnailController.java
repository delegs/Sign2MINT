package de.wps.sign2MintServer.controller;

import de.wps.sign2MintServer.materials.Lexikoneintrag;
import de.wps.sign2MintServer.services.FrameGrabService;
import de.wps.sign2MintServer.services.LexikoneintragService;
import org.apache.commons.io.IOUtils;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

@RestController
@RequestMapping("/thumbnail")
public class ThumbnailController {
    private final FrameGrabService frameGrabService;
    private final LexikoneintragService lexikoneintragService;

    public ThumbnailController(FrameGrabService frameGrabService, LexikoneintragService lexikoneintragService) {
        this.lexikoneintragService = lexikoneintragService;
        this.frameGrabService = frameGrabService;
    }

    @GetMapping(path = "/{id}", produces = MediaType.IMAGE_PNG_VALUE)
    public byte[] getThumbnailFor(@PathVariable String id) {
        Lexikoneintrag lexikonEintrag = lexikoneintragService.getLexikoneintragById(id);
        try {
            File thumbnail = frameGrabService.getThumbnailForVideo(lexikonEintrag.getVideoLink());
            FileInputStream fileInputStream = new FileInputStream(thumbnail);
            return IOUtils.toByteArray(fileInputStream);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }
}

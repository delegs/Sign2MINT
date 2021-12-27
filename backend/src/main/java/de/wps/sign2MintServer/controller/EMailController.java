package de.wps.sign2MintServer.controller;

import de.wps.sign2MintServer.materials.EMailForm;
import de.wps.sign2MintServer.services.EMailService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mail")
public class EMailController {
    private final EMailService eMailService;

    public EMailController(EMailService eMailService) {
        this.eMailService = eMailService;
    }

    @PostMapping(path = "/send", produces = MediaType.APPLICATION_JSON_VALUE)
    public boolean sendEmail(@RequestBody EMailForm body) {
        return eMailService.sendEmail(body.getSubject(), body.getContent());
    }
}

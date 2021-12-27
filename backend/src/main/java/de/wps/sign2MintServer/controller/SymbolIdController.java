package de.wps.sign2MintServer.controller;

import de.wps.sign2MintServer.materials.SymbolId;
import de.wps.sign2MintServer.repositories.LexikoneintragRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/symbolIds")
public class SymbolIdController {

    private final LexikoneintragRepository lexikoneintragRepository;

    public SymbolIdController(LexikoneintragRepository lexikoneintragRepository) {
        this.lexikoneintragRepository = lexikoneintragRepository;
    }

    @PostMapping("/byKeys")
    public List<SymbolId> getAllSymbolIds(@RequestBody List<String> symbolKeys) {

        return lexikoneintragRepository.collectBySymbolKeys(symbolKeys);
    }
}

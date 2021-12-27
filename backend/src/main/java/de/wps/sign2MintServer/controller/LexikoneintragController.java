package de.wps.sign2MintServer.controller;

import java.util.List;
import java.util.Optional;

import de.wps.sign2MintServer.materials.SymbolId;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import de.wps.sign2MintServer.materials.Lexikoneintrag;
import de.wps.sign2MintServer.services.LexikoneintragService;

@RestController
@RequestMapping("/entries")
public class LexikoneintragController {

	final LexikoneintragService lexikoneintragService;

	public LexikoneintragController(LexikoneintragService lexikoneintragService) {
		this.lexikoneintragService = lexikoneintragService;
	}

	@GetMapping(path = "/all", produces = MediaType.APPLICATION_JSON_VALUE)
	public List<Lexikoneintrag> getAllEntries(@RequestParam Optional<List<String>> fachgebiete) {
		return lexikoneintragService.getLexikoneintraege(fachgebiete);
	}

	@GetMapping(path = "/count", produces = MediaType.APPLICATION_JSON_VALUE)
	public int getEntryCount(@RequestParam Optional<List<String>> fachgebiete) {
		return lexikoneintragService.getLexikoneintraege(fachgebiete).size();
	}

	@GetMapping(path = "/fachbegriff/{fachbegriff}", produces = MediaType.APPLICATION_JSON_VALUE)
	public List<Lexikoneintrag> getLexikoneintragByFachbegriff(@PathVariable String fachbegriff,
			@RequestParam Optional<List<String>> fachgebiete) {
		return lexikoneintragService.getLexikoneintragByFachbegriffANDFachgebiete(fachbegriff, fachgebiete);
	}

	@GetMapping(path = "/id/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public Lexikoneintrag getLexikoneintragById(@PathVariable String id) {
		return lexikoneintragService.getLexikoneintragById(id);
	}

	@GetMapping(path = "/all/{character}", produces = MediaType.APPLICATION_JSON_VALUE)
	public List<Lexikoneintrag> getLexikoneintraegeForChar(@PathVariable String character,
			@RequestParam Optional<List<String>> fachgebiete) {
		return lexikoneintragService.getLexikoneintraegeForChar(character, fachgebiete);
	}

	@GetMapping(path = "/search/{searchTerm}", produces = MediaType.APPLICATION_JSON_VALUE)
	public List<Lexikoneintrag> getLexikoneintaegeForSearchTerm(@PathVariable String searchTerm) {
		return lexikoneintragService.getLexikoneintraegeBySearchTerm(searchTerm);
	}

	@PostMapping(path = "/symbolIds")
	public List<Lexikoneintrag> findLexikoneintraegeForAllSymbolGroups(@RequestBody List<SymbolId> symbolIds) {
		return lexikoneintragService.findLexikoneintraegeForAllSymbolIds(symbolIds);
	}
}

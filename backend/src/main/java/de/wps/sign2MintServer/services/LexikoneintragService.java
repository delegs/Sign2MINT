package de.wps.sign2MintServer.services;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import de.wps.sign2MintServer.materials.SymbolId;
import org.springframework.stereotype.Service;

import de.wps.sign2MintServer.materials.Lexikoneintrag;
import de.wps.sign2MintServer.repositories.LexikoneintragRepository;

@Service
public class LexikoneintragService {
    private final DefinitionService DEFINITION_SERVICE;
    private final LexikoneintragRepository lexikoneintragRepository;

    public LexikoneintragService(DefinitionService definitionService,
                                 LexikoneintragRepository lexikoneintragRepository) {
        this.DEFINITION_SERVICE = definitionService;
        this.lexikoneintragRepository = lexikoneintragRepository;
        this.lexikoneintragRepository.loadLexikoneintraegeFromApiAsync();
    }

    public List<Lexikoneintrag> getLexikoneintraege(Optional<List<String>> fachgebiete) {
        return lexikoneintragRepository.findAll().stream().filter(le -> isMatchFachgebiete(fachgebiete, le))
                .collect(Collectors.toList());
    }

    public List<Lexikoneintrag> getLexikoneintraegeForChar(String character, Optional<List<String>> fachgebiete) {
        character = character.toLowerCase();
        List<Lexikoneintrag> result = new ArrayList<>();
        List<Lexikoneintrag> gefilterteEintraege = filterEintraegeByDuplicateFachbegriff(
                lexikoneintragRepository.findAll());
        if ("0-9".equals(character)) {
            for (Lexikoneintrag eintrag : gefilterteEintraege) {
                boolean matchFachgebiete = isMatchFachgebiete(fachgebiete, eintrag);
                if (eintrag.getFachbegriff().matches("^\\d.*") && matchFachgebiete) {
                    result.add(eintrag);
                }
            }
        }
        for (Lexikoneintrag eintrag : gefilterteEintraege) {
            boolean matchFachgebiete = isMatchFachgebiete(fachgebiete, eintrag);
            if (eintrag.getFachbegriff().toLowerCase().startsWith(character) && matchFachgebiete) {
                result.add(eintrag);
            }
        }
        result.sort(Lexikoneintrag.LEXIKONEINTRAGSCOMPARATOR);
        return result;
    }

    public List<Lexikoneintrag> getLexikoneintragByFachbegriffANDFachgebiete(String fachbegriff,
                                                                             Optional<List<String>> fachgebiete) {
        List<Lexikoneintrag> result = new ArrayList<>();

        for (Lexikoneintrag eintrag : lexikoneintragRepository.findAll()) {
            boolean matchFachgebiete = isMatchFachgebiete(fachgebiete, eintrag);

            if (eintrag.getFachbegriff().equalsIgnoreCase(fachbegriff) && matchFachgebiete) {
                if (!eintrag.getWortlink().equals("") && !eintrag.getBedeutungsnummern().equals("") && (eintrag.getDefinition() == null || "".equals(eintrag.getDefinition()))) {
                    eintrag.setDefinition(DEFINITION_SERVICE.getBedeutungFromWort(eintrag.getBedeutungsnummern(),
                            eintrag.getWortlink()));
                }
                result.add(eintrag);
            }
        }

        return result.size() > 0 ? result : null;
    }

    private boolean isMatchFachgebiete(Optional<List<String>> fachgebiete, Lexikoneintrag eintrag) {
        return fachgebiete.map(strings -> strings.stream().anyMatch(fg -> eintrag.getFachgebiete().contains(fg))).orElse(true);
    }

    public List<Lexikoneintrag> filterEintraegeByDuplicateFachbegriff(List<Lexikoneintrag> lexikonEintraege) {
        return lexikonEintraege.stream().filter(distinctByKey(Lexikoneintrag::getFachbegriff))
                .collect(Collectors.toList());
    }

    public static <T> Predicate<T> distinctByKey(Function<? super T, ?> keyExtractor) {
        Set<Object> seen = ConcurrentHashMap.newKeySet();
        return t -> seen.add(keyExtractor.apply(t));
    }

    public Lexikoneintrag getLexikoneintragById(String id) {
        final var lexikonEintraege = lexikoneintragRepository.findAll();

        var lexikonEintrag = lexikonEintraege.stream().filter(entry -> entry.getId().equals(id)).findFirst().orElse(null);

        if (lexikonEintrag != null && !lexikonEintrag.getWortlink().equals("") && !lexikonEintrag.getBedeutungsnummern().equals("")) {
            lexikonEintrag.setDefinition(DEFINITION_SERVICE.getBedeutungFromWort(lexikonEintrag.getBedeutungsnummern(), lexikonEintrag.getWortlink()));
        }

        return lexikonEintrag;
    }

    public List<Lexikoneintrag> getLexikoneintraegeBySearchTerm(String searchTerm) {
        if (searchTerm.length() < 3) {
            return filterEintraegeByDuplicateFachbegriff(lexikoneintragRepository.findAll()).stream()
                    .filter((Lexikoneintrag lexikoneintrag) -> lexikoneintrag.getFachbegriff().toLowerCase()
                            .startsWith(searchTerm.trim().toLowerCase()))
                    .sorted(Lexikoneintrag.LEXIKONEINTRAGSCOMPARATOR)
                    .collect(Collectors.toList());
        }

        return sortByDistance(searchTerm,
                filterEintraegeByDuplicateFachbegriff(lexikoneintragRepository.findAll()).stream()
                        .filter((Lexikoneintrag lexikoneintrag) -> lexikoneintrag.getFachbegriff().toLowerCase()
                                .contains(searchTerm.trim().toLowerCase()))
                        .sorted(Lexikoneintrag.LEXIKONEINTRAGSCOMPARATOR)
                        .collect(Collectors.toList()));
    }

    public List<Lexikoneintrag> sortByDistance(String inputWord, List<Lexikoneintrag> inputList) {
        inputList.sort((o1, o2) -> {
            String fachbegriff1 = o1.getFachbegriff().toLowerCase();
            String fachbegriff2 = o2.getFachbegriff().toLowerCase();
            return Integer.compare(Lexikoneintrag.calculateDistance(inputWord.toLowerCase(), fachbegriff1),
                    Lexikoneintrag.calculateDistance(inputWord, fachbegriff2));
        });

        return inputList;
    }

    private boolean containsAnySymbolId(List<SymbolId> receivedSymbolIds, Lexikoneintrag eintrag) {

        var gebaerdenschrift = eintrag.getGebaerdenschrift();
        var lexikonEintragsSymbolIds = gebaerdenschrift.getSymbolIds();

        return receivedSymbolIds.stream()
                .anyMatch(receivedSymbolId -> lexikonEintragsSymbolIds.stream()
                        .anyMatch(lexikonEintragsSymbolId -> lexikonEintragsSymbolId.matches(receivedSymbolId)));
    }

    public List<Lexikoneintrag> findLexikoneintraegeForAllSymbolIds(List<SymbolId> symbolIds) {

       List<Lexikoneintrag> result = lexikoneintragRepository.findAll();

       for (var symbolId : symbolIds) {

           var allophone = symbolId.getAllophone();

           var phonemAndAllophone = new ArrayList<SymbolId>();
           phonemAndAllophone.add(symbolId);
           phonemAndAllophone.addAll(allophone);

           result = result.stream().filter(lexikoneintrag -> containsAnySymbolId(phonemAndAllophone, lexikoneintrag)).collect(Collectors.toList());
       }

        return result;
    }
}

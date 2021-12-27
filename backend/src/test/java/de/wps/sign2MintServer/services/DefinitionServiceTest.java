package de.wps.sign2MintServer.services;

import de.wps.sign2MintServer.materials.Genus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class DefinitionServiceTest {

    private DefinitionService definitionService;
    private RestTemplate restServiceMock;

    @BeforeEach
    void setup() {
        restServiceMock = mock(RestTemplate.class);
        definitionService = new DefinitionService(restServiceMock);
    }

    @Test
    void getWortFromWortlink() {
        // Arrange
        final String wort = "peru";
        final String url = "asdasd/w/asd/as/das/d/sad/asd/sad/a/sdsa/d/sad/" + wort;

        // Act + Assert
        assertEquals(wort, definitionService.getWortFromWortlink(url));
    }

    @Test
    void getWikiText_wikitext() {
        // Arrange
        final String wikitext = "Einst lebte ein Mann in Peru.";
        final String suchwort = "Schuh";
        final String json = "{\n"
                + "    \"parse\": {\n"
                + "        \"title\": \"" + suchwort + "\",\n"
                + "        \"pageid\": 281070,\n"
                + "        \"wikitext\": {\n"
                + "            \"*\": \"" + wikitext + "\"\n"
                + "        }\n"
                + "    }\n"
                + "}";
        var response = new ResponseEntity<>(json, HttpStatus.OK);
        when(restServiceMock.getForEntity(DefinitionService.apiUrl + suchwort, String.class)).thenReturn(response);

        // Act
        final var result = definitionService.getWikitext(suchwort);

        // Assert
        verify(restServiceMock).getForEntity(DefinitionService.apiUrl + suchwort, String.class);
        assertEquals(wikitext, result);
    }

    @Test
    void getWikiText_no_wikitext() {
        // Arrange
        final String wikitext = "";
        final String suchwort = "Schuh";
        final ResponseEntity<String> response = new ResponseEntity<>(null, HttpStatus.OK);
        when(restServiceMock.getForEntity(DefinitionService.apiUrl + suchwort, String.class)).thenReturn(response);

        // Act
        final var result = definitionService.getWikitext(suchwort);

        // Assert
        verify(restServiceMock).getForEntity(DefinitionService.apiUrl + suchwort, String.class);
        assertEquals(wikitext, result);
    }

    @Test
    void getBedeutungFromWort() {
        // Arrange
        final String wikitext = "{{Bedeutungen}}[1] Einst lebte ein Mann in Peru.\n";
        final String suchwort = "Schuh";
        final String wortlink = "asda/da/sda/sd/as/das/d/asd/as/das/d/" + suchwort;
        final String json = "{\n"
                + "    \"parse\": {\n"
                + "        \"title\": \"" + suchwort + "\",\n"
                + "        \"pageid\": 281070,\n"
                + "        \"wikitext\": {\n"
                + "            \"*\": \"" + wikitext + "\n\"\n"
                + "        }\n"
                + "    }\n"
                + "}";
        var response = new ResponseEntity<>(json, HttpStatus.OK);
        when(restServiceMock.getForEntity(DefinitionService.apiUrl + suchwort, String.class)).thenReturn(response);

        // Act
        final var result = definitionService.getBedeutungFromWort("1", wortlink);

        // Assert
        verify(restServiceMock).getForEntity(DefinitionService.apiUrl + suchwort, String.class);
        assertEquals("[1] Einst lebte ein Mann in Peru.\n", result);
    }

    @Test
    void getBedeutungen() {
        // Arrange
        final String bedeutungen = "{{Bedeutungen}}\\n:[1] {{K|Geometrie}} [[Test]] fuer API\n\n";
        final String wikitext =
                "kauderwelschkauderwelschkauderwelsch// ## {{kauderwelsch}} " + bedeutungen + "{{42}}kauderwelsch";
        final List<Genus> genera = new ArrayList<>();

        // Act
        final var result = definitionService.getBedeutungen(wikitext, genera);

        // Assert
        assertEquals(bedeutungen, result);
    }

    @Test
    void getBedeutungen_no_Bedeutung() {
        // Arrange
        final String bedeutungen = "";
        final String wikitext = "kauderwelschkauderwelschkauderwelsch// ## {{kauderwelsch}} {{Herkunft}}\n:[1] {{K|Geometrie}} [[Test]] fuer API{{42}}kauderwelsch";
        final List<Genus> genera = new ArrayList<>();

        // Act
        final var result = definitionService.getBedeutungen(wikitext, genera);

        // Assert
        assertEquals(bedeutungen, result);
    }

    @Test
    void getBedeutung() {
        // Arrange
        final var bedeutung1 = "[1] der 24. [[Buchstabe]] des [[Alphabet]]s";
        final var bedeutung2 = "[2] {{K|Mathematik}} die eine oder erste [[unbekannt]]e [[Zahl]]";
        final var bedeutung3 = "[3] {{ugs.|:}} irgendeine [[unbestimmt]]e ziemlich [[große]] Zahl";
        String bedeutungen = String.join("\n:", bedeutung1, bedeutung2, bedeutung3) + "\n\n";

        // Act + Assert
        assertEquals(bedeutung1, definitionService.getBedeutung(bedeutungen, "1"));
        assertEquals(bedeutung2, definitionService.getBedeutung(bedeutungen, "2"));
        assertEquals(bedeutung3, definitionService.getBedeutung(bedeutungen, "3"));
    }

    @Test
    void getBedeutung_wrong_Bedeutungsnummer() {
        // Arrange
        final var bedeutung1 = "[1] der 24. [[Buchstabe]] des [[Alphabet]]s";
        final var bedeutung2 = "[2] {{K|Mathematik}} die eine oder erste [[unbekannt]]e [[Zahl]]";
        final var bedeutung3 = "[3] {{ugs.|:}} irgendeine [[unbestimmt]]e ziemlich [[große]] Zahl";
        String bedeutungen = String.join("\n:", bedeutung1, bedeutung2, bedeutung3) + "\n\n";

        // Act + Assert
        assertEquals("", definitionService.getBedeutung(bedeutungen, "5"));
    }

    @Test
    void cleanBedeutung() {
        // Arrange
        final var bedeutung = "[2] {{K|Mathematik}} die eine oder erste [[unbekannt]]e [[Zahl]]";

        // Act
        final var result = definitionService.cleanBedeutung(bedeutung);

        // Assert
        assertEquals("[2] Mathematik: die eine oder erste unbekannte Zahl", result);
    }

    @Test
    void testGetGenusListFromWortlink() {
        //Arrange
        final var wortLink = "https://de.wiktionary.org/wiki/Quark#Substantiv,_n";

        //Act
        List<Genus> genera = definitionService.getGeneraFromWortlink(wortLink);

        //Assert
        List<Genus> expectedResult = new ArrayList<>();
        expectedResult.add(Genus.n);
        assertEquals(expectedResult, genera);
    }

    @Test
    void testGetGeneraListFromWortlink() {
        //Arrange
        final var wortLink = "https://de.wiktionary.org/wiki/Gehalt#Substantiv,_n,_m";

        //Act
        List<Genus> genera = definitionService.getGeneraFromWortlink(wortLink);

        //Assert
        List<Genus> expectedResult = new ArrayList<>();
        expectedResult.add(Genus.n);
        expectedResult.add(Genus.m);
        assertEquals(expectedResult, genera);
    }

    @Test
    void testGetEmptyGeneraListFromWortlink() {
        //Arrange
        final var wortLink = "https://de.wiktionary.org/wiki/Quark";

        //Act
        List<Genus> genera = definitionService.getGeneraFromWortlink(wortLink);

        //Assert
        List<Genus> expectedResult = new ArrayList<>();
        assertEquals(expectedResult, genera);
    }
}

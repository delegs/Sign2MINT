package de.wps.sign2MintServer.validation;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.util.Assert;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonParser;

import de.wps.sign2MintServer.materials.Lexikoneintrag;

public class LexikonEintragsJsonValidatorTest {

    final List<String> symbolIds = new ArrayList<>();
    final Map<String, Object> propertyMap = new HashMap<>();
    LexikonEintragsJsonValidator validator;

    @BeforeEach
    private void setup() {

        symbolIds.add("01-05-001-01-01-03");
        symbolIds.add("01-10-015-01-02-01");
        symbolIds.add("01-10-015-01-02-09");
        symbolIds.add("02-02-008-02-04-07");
        symbolIds.add("02-05-001-02-01-07");
        symbolIds.add("02-09-007-01-01-05");
        symbolIds.add("02-09-007-01-02-05");
        symbolIds.add("03-01-004-03-01-05");
        symbolIds.add("04-01-001-01-01-01");
        symbolIds.add("04-01-001-01-01-01");
        symbolIds.add("04-01-001-01-01-01");
        symbolIds.add("04-04-004-03-02-01");
        symbolIds.add("04-05-001-05-02-01");
        symbolIds.add("04-05-001-05-02-01");
        symbolIds.add("04-99-999-98-01-01");

        propertyMap.put(Lexikoneintrag.BedeutungsnummerMemberName, "1");
        propertyMap.put(Lexikoneintrag.FachbegriffMemberName, "Thermodynamik");
        propertyMap.put(Lexikoneintrag.VideoUrlnMemberName, "https://apps.delegs.de/delegseditormedia/DelegsVideoSupplierServlet/W01125_Thermodynamik1.mp4");
        propertyMap.put(Lexikoneintrag.FachgebietMemberName, "Physik");
        propertyMap.put(Lexikoneintrag.UrsprungMemberName, "Bestand");
        propertyMap.put(Lexikoneintrag.VerwendungskontextMemberName, "Schulischer Bereich");
        propertyMap.put(Lexikoneintrag.WikipediaMemberName, "https://de.wikipedia.org/wiki/Thermodynamik");
        propertyMap.put(Lexikoneintrag.WiktionaryMemberName, "https://de.wiktionary.org/wiki/Thermodynamik");
        propertyMap.put(Lexikoneintrag.EmpfehlungMemberName, "ja");

        var gebaerdenschriftMap = new HashMap<String, Object>();
        gebaerdenschriftMap.put(Lexikoneintrag.GebaerdenschriftUrlMemberName, "https://apps.delegs.de/delegseditor/signwritingeditor/signimages?upperId=29571&lowerId=THERMODYNAMIK1&signlocale=DGS");
        gebaerdenschriftMap.put(Lexikoneintrag.SymbolIdsMemberName, symbolIds);
        propertyMap.put(Lexikoneintrag.GebaerdenSchriftenMemberName, gebaerdenschriftMap);
        propertyMap.put(Lexikoneintrag.IdMemberName, "1400421743287847:4160");

        validator = new LexikonEintragsJsonValidator();
    }

    @Test
    void validLexikoneintragIsValid() {

    	// Assembly
        var jsonArray = createJsonArrayFromMap();

        // Act
        var validLexikoneintraege = validator.validateJsonElements(jsonArray);

        // Assert
        assertEquals(1, validLexikoneintraege.size());

    }

    @Test
    void removeOnMissingRequiredProperty() {

        propertyMap.remove(Lexikoneintrag.FachbegriffMemberName);
        var jsonArray = createJsonArrayFromMap();

        var validLexikoneintraege = validator.validateJsonElements(jsonArray);
        Assert.isTrue(validLexikoneintraege.size() == 0,"expected size is 0");
    }

    @Test
    void removeOnInvalidRequiredProperty() {

        propertyMap.replace(Lexikoneintrag.FachbegriffMemberName, "");
        var jsonArray = createJsonArrayFromMap();

        var validLexikoneintraege = validator.validateJsonElements(jsonArray);
        Assert.isTrue(validLexikoneintraege.size() == 0,"expected size is 0");
    }

    @Test
    void removeOnInvalidUrlProperty() {

        propertyMap.replace(Lexikoneintrag.VideoUrlnMemberName, "irgendeinquatsch");
        var jsonArray = createJsonArrayFromMap();

        var validLexikoneintraege = validator.validateJsonElements(jsonArray);
        Assert.isTrue(validLexikoneintraege.size() == 0,"expected size is 0");
    }

    @Test
    void removeOnInvalidObjectProperty() {

        propertyMap.replace(Lexikoneintrag.GebaerdenSchriftenMemberName, "irgendeinquatsch");
        var jsonArray = createJsonArrayFromMap();

        var validLexikoneintraege = validator.validateJsonElements(jsonArray);
        Assert.isTrue(validLexikoneintraege.size() == 0,"expected size is 0");
    }

    @Test
    void removeOnInvalidOptionalPropertyValue() {

        propertyMap.replace(Lexikoneintrag.WikipediaMemberName, "wikipedialink");
        var jsonArray = createJsonArrayFromMap();

        var validLexikoneintraege = validator.validateJsonElements(jsonArray);
        Assert.isTrue(validLexikoneintraege.size() == 0,"expected size is 0");
    }

    @Test
    void ignoreUnusedProperty() {

        propertyMap.put("FooBar", "jaupsie");
        var jsonArray = createJsonArrayFromMap();

        var validLexikoneintraege = validator.validateJsonElements(jsonArray);
        Assert.isTrue(validLexikoneintraege.size() == 1,"expected size is 1");
    }

    @Test
    void removeOnInvalidSymbolId() {

        symbolIds.add("00-00-000-0000-00");

        var jsonArray = createJsonArrayFromMap();

        var validLexikoneintraege = validator.validateJsonElements(jsonArray);
        Assert.isTrue(validLexikoneintraege.size() == 0, "expected size is 0");
    }


    private JsonArray createJsonArrayFromMap() {

        var json  = new Gson().toJson(propertyMap);
        var jsonElement = JsonParser.parseString(json);
        var jsonObject = jsonElement.getAsJsonObject();

        var jsonArray = new JsonArray();
        jsonArray.add(jsonObject);
        return jsonArray;
    }
}

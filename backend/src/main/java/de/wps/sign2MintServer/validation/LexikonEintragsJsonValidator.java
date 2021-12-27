package de.wps.sign2MintServer.validation;

import java.lang.invoke.MethodHandles;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import de.wps.sign2MintServer.materials.Lexikoneintrag;
import de.wps.sign2MintServer.materials.SymbolId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

@Component
public class LexikonEintragsJsonValidator {

    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

	public final Map<String, ValidationType> requiredMembers = new HashMap<>() {{
        put(Lexikoneintrag.IdMemberName, ValidationType.String);
        put(Lexikoneintrag.VideoUrlnMemberName, ValidationType.URL);
        put(Lexikoneintrag.FachgebietMemberName, ValidationType.String);
        put(Lexikoneintrag.VerwendungskontextMemberName, ValidationType.String);
        put(Lexikoneintrag.FachbegriffMemberName, ValidationType.String);
        put(Lexikoneintrag.GebaerdenSchriftenMemberName, ValidationType.Object);
    }};

    public final Map<String, ValidationType> optionalMembers = new HashMap<>() {{
        put(Lexikoneintrag.GebaerdenschriftUrlMemberName, ValidationType.URL);
        put(Lexikoneintrag.SymbolIdsMemberName, ValidationType.SymbolIdArray);
        put(Lexikoneintrag.UrsprungMemberName, ValidationType.String);
        put(Lexikoneintrag.EmpfehlungMemberName, ValidationType.String);
        put(Lexikoneintrag.WiktionaryMemberName, ValidationType.URL);
        put(Lexikoneintrag.BedeutungsnummerMemberName, ValidationType.String);
        put(Lexikoneintrag.WikipediaMemberName, ValidationType.URL);
        put(Lexikoneintrag.SonstigesMemberName, ValidationType.String);
    }};

    public final Map<String, ValidationType> allMembers = new HashMap<>();

    public LexikonEintragsJsonValidator() {

        allMembers.putAll(requiredMembers);
        allMembers.putAll(optionalMembers);
    }

    /**
     * Validates each JsonElement in the array whether all necessary members are present and all necessary / optional members are valid
     * @param receivedJsonArray the jsonArray of JsonElements to validate
     * @return a List of valid JsonElements
     */
    public List<JsonElement> validateJsonElements(JsonArray receivedJsonArray) {

        var validationEntryMessage = String.format("Start validation of %d received elements", receivedJsonArray.size());
        LOGGER.info(validationEntryMessage);

        var receivedJsonElements = StreamSupport.stream(receivedJsonArray.spliterator(), false).collect(Collectors.toList());
        validate(receivedJsonElements);

        var validationResultMessage = String.format("Validation finished. %d/%d elements valid.", receivedJsonElements.size(), receivedJsonArray.size());
        LOGGER.info(validationResultMessage);

        return receivedJsonElements;
    }

    /**
     * Validates each JsonElement in the list whether all necessary members are present and all necessary / optional members are valid
     * @param receivedJsonElements the received JsonElements to validate
     */
    private void validate(List<JsonElement> receivedJsonElements) {

        List<JsonElement> invalidJsonElements = new ArrayList<>();

        for (var receivedJsonElement : receivedJsonElements) {

            var receivedJsonObject = receivedJsonElement.getAsJsonObject();
            var isMemberValid = isJsonElementValid(receivedJsonObject, allMembers);
            if(!isMemberValid)
                invalidJsonElements.add(receivedJsonElement);
        }

        for(var invalidJsonElement : invalidJsonElements)
            receivedJsonElements.remove(invalidJsonElement);
    }


    private boolean isJsonElementValid(JsonObject receivedJsonObject, Map<String, ValidationType> membersToValidate) {

        boolean isMemberValid = true;

        for (var member : membersToValidate.entrySet()) {

            if(!isMemberValid)
                break;

            var memberName = member.getKey();
            var validationType = member.getValue();

            if (receivedJsonObject.has(memberName)) {

                var memberValue = receivedJsonObject.get(memberName);

                switch (validationType) {
                    case String:
                        if(requiredMembers.containsKey(memberName))
                            isMemberValid = isValidString(memberValue, false);
                        break;
                    case URL:
                        var isEmptyUrlValid = optionalMembers.containsKey(memberName);
                        isMemberValid = isValidUrl(memberValue, isEmptyUrlValid);
                        break;
                    case Object:
                        isMemberValid = isValidObject(memberValue);
                        if (isMemberValid) {
                            var memberValueAsJsonObject = memberValue.getAsJsonObject();

                            var subMembersToValidateMap = new HashMap<String, ValidationType>();
                            for (var key : memberValueAsJsonObject.keySet())
                            {
                                var value = allMembers.get(key);
                                subMembersToValidateMap.put(key, value);
                            }

                            isMemberValid = isJsonElementValid(memberValueAsJsonObject, subMembersToValidateMap);
                        }
                        break;
                    case Array:
                        isMemberValid = isValidArray(memberValue);
                        break;
                    case SymbolIdArray:
                        isMemberValid = isValidSymbolIdArray(memberValue);
                        break;
                }

                if (!isMemberValid) {
                    var invalidMemberMessage = String.format("Value of Member '%s' is invalid in JsonObject '%s'", memberName, receivedJsonObject);
                    LOGGER.warn(invalidMemberMessage);
                }
            }
            else {

                if (requiredMembers.containsKey(memberName)) {
                    var missingMemberMessage = String.format("Missing Member: '%s' in JsonObject '%s'",memberName, receivedJsonObject);
                    LOGGER.warn(missingMemberMessage);
                    isMemberValid = false;
                }
            }
        }

        return isMemberValid;
    }

    /**
     * @param jsonElement the jsonElement to validate
     * @param isEmptyValid defines whether the string is valid when its empty
     * @return a boolean that indicates whether the jsonElement contains a string that is not null or empty
     */
    private boolean isValidString(JsonElement jsonElement, boolean isEmptyValid) {
        String string = jsonElement.getAsString();
        return !string.trim().isEmpty() || isEmptyValid;
    }

    /**
     * @param jsonElement the jsonElement to validate
     * @param isEmptyValid defines whether the Url is valid when its empty
     * @return a boolean that indicates whether the jsonElement contains a valid url
     */
    private boolean isValidUrl(JsonElement jsonElement, boolean isEmptyValid) {
        String url = jsonElement.getAsString();
        try {
            var regex = "(((ftp|http|https):\\/\\/)|(\\/)|(..\\/))(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-\\/]))?";
            return url.isEmpty() ? isEmptyValid : url.matches(regex);
        }
        catch (NullPointerException e) {
            return false;
        }
    }

    /**
     * @param jsonElement the jsonElement to validate
     * @return a boolean that indicates whether the jsonElement is a valid JsonObject
     */
    private boolean isValidObject(JsonElement jsonElement) {
        try {
            jsonElement.getAsJsonObject();
            return true;
        }
        catch (IllegalStateException e) {
            return false;
        }
    }

    /**
     * @param jsonElement the jsonElement to validate
     * @return a boolean that indicates whether the jsonElement contains a valid array
     */
    private boolean isValidArray(JsonElement jsonElement) {
        try {
            jsonElement.getAsJsonArray();
            return true;
        } catch (IllegalStateException e) {
            return false;
        }
    }

    /**
     * @param jsonElement the jsonElement to validate
     * @return a boolean that indicates whether the jsonElement contains a valid array of symbol ids
     */
    private boolean isValidSymbolIdArray(JsonElement jsonElement) {
        try {
            var jsonArray = jsonElement.getAsJsonArray();

            for (var symbolIdString : jsonArray)
                if(!SymbolId.isValid(symbolIdString.getAsString()))
                    return false;

            return true;
        } catch (IllegalStateException e) {
            return false;
        }
    }
}

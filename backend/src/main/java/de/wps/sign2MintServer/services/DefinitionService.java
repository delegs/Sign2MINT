package de.wps.sign2MintServer.services;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import de.wps.sign2MintServer.materials.Genus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.lang.invoke.MethodHandles;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class DefinitionService {

    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    final static String apiUrl = "https://de.wiktionary.org/w/api.php?action=parse&prop=wikitext&format=json&page=";

    private final RestTemplate restService;

    public DefinitionService(RestTemplate restService) {
        this.restService = restService;
    }

    String getBedeutungFromWort(String bedeutungsnummern, String wortlink) {
        String wort = getWortFromWortlink(wortlink);
        List<Genus> genera = getGeneraFromWortlink(wortlink);
        LOGGER.info("getBedeutung for " + wort);

        String wikitext = getWikitext(wort);
        if(wikitext.isEmpty())
            return wikitext;

        String bedeutungen = getBedeutungen(wikitext, genera);
        String bedeutung = "";
        for (String bedeutungsnummer : bedeutungsnummern.split(",")) {
            String bedeutungForBedeutungsnummer = getBedeutung(bedeutungen, bedeutungsnummer);
            bedeutung = bedeutung.concat(bedeutungForBedeutungsnummer + "\n");
        }
        return cleanBedeutung(bedeutung);
    }

    List<Genus> getGeneraFromWortlink(String wortlink) {
        List<Genus> genera = new ArrayList<>();
        String[] splittedLink = wortlink.split(",_");
        for (String splittedString : splittedLink) {
            if (Arrays.stream(Genus.values()).anyMatch(v -> v.toString().equals(splittedString))) {
                genera.add(Genus.valueOf(splittedString));
            }
        }
        return genera;
    }

    String getWortFromWortlink(String wortlink) {
        String[] splittedWortlink = wortlink.split("/");
        return decodeMethod(splittedWortlink[splittedWortlink.length - 1]);
    }

    String decodeMethod(String encode) {
        return URLDecoder.decode(encode, StandardCharsets.UTF_8);
    }

    String getWikitext(String wort) {

        try {
            final var apiResponse = restService.getForEntity(apiUrl + wort, String.class);
            JsonObject responseJson = JsonParser.parseString(Objects.requireNonNull(apiResponse.getBody())).getAsJsonObject();
            JsonObject parseMember = responseJson.getAsJsonObject("parse");
            JsonObject wikitextMember = parseMember.getAsJsonObject("wikitext");
            return  wikitextMember.get("*").getAsString();
        } catch (Exception e) {
            LOGGER.warn("Keine Definition für " + wort + " gefunden");
            return "";
        }
    }

    String getBedeutungen(String wikitext, List<Genus> genera) {

        if (!genera.isEmpty()) {
            var splittedVariants = wikitext.split("Übersicht\\n\\|");
            Map<List<Genus>, String> generaToVariantMap = new HashMap<>();

            for (var splittedVariant : splittedVariants) {

                var splittedGenera = splittedVariant.split("Genus( \\d)*=");

                List<Genus> generaForVariant = new ArrayList<>();
                for (String splittedGenus : splittedGenera) {
                    if (!splittedGenus.equals("")) {

                        String genusChar = Character.toString(splittedGenus.charAt(0));
                        if (Arrays.stream(Genus.values()).anyMatch(v -> v.toString().equals(genusChar))) {
                            generaForVariant.add(Genus.valueOf(genusChar));
                        }
                    }
                }

                generaToVariantMap.put(generaForVariant, splittedVariant);
            }
            wikitext = generaToVariantMap.get(genera) != null ? generaToVariantMap.get(genera) : "";
        }

        Pattern pattern = Pattern.compile("\\{\\{Bedeutungen}}.*?(\\n){2}", Pattern.DOTALL);

        Matcher matcher = pattern.matcher(wikitext);
        if (matcher.find()) {
            return matcher.group(0);
        } else {
            LOGGER.warn("Bedeutungen not found in Wikitext");
        }
        return "";
    }

    String getBedeutung(String bedeutungen, String bedeutungsnummer) {
        String regex = "\\[" + bedeutungsnummer + "\\].*";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(bedeutungen);
        if (matcher.find()) {
            return matcher.group(0);
        } else {
            LOGGER.warn("Bedeutungsnummer " + bedeutungsnummer + " not found in Bedeutungen");
        }
        return "";
    }

    String cleanBedeutung(String bedeutung) {
        String cleanedBedeutung = bedeutung.replaceAll("\\{\\{K\\|", "");
        cleanedBedeutung = cleanedBedeutung.replaceAll("\\'\\'", "");

        String regex = "\\[\\[[^\\d]*[a-z]\\]\\]";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(cleanedBedeutung);

        while (matcher.find()) {
            String foundWord = matcher.group();
            String cleanedBedeutungOhneKlammern = foundWord.replaceAll("\\]\\]", "");
            cleanedBedeutungOhneKlammern = cleanedBedeutungOhneKlammern.replaceAll("\\[\\[", "");
            cleanedBedeutungOhneKlammern = cleanedBedeutungOhneKlammern.replace("\\{\\{", "");
            cleanedBedeutung = cleanedBedeutung.replace(foundWord, cleanedBedeutungOhneKlammern);
        }

        cleanedBedeutung = cleanedBedeutung.replaceAll("\\}\\}", ":");

        return cleanedBedeutung;
    }
}


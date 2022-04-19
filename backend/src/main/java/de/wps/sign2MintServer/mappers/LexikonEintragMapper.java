package de.wps.sign2MintServer.mappers;

import java.lang.invoke.MethodHandles;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import de.wps.sign2MintServer.materials.SymbolId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import de.wps.sign2MintServer.materials.Gebaerdenschrift;
import de.wps.sign2MintServer.materials.Lexikoneintrag;

import static de.wps.sign2MintServer.materials.Lexikoneintrag.*;

@Component
public class LexikonEintragMapper {

    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    public Lexikoneintrag map(JsonObject eintrag) {

        String id = eintrag.get(IdMemberName).getAsString().trim();

        Gebaerdenschrift gebaerdenschrift = null;
        try {
            	JsonObject signObject = eintrag.get(GebaerdenSchriftenMemberName).getAsJsonObject();
                String gebaerdenschriftLink = signObject.get(GebaerdenschriftUrlMemberName).getAsString();

                ArrayList<SymbolId> symbolIds = new ArrayList<>();
                for (JsonElement symbolId : signObject.get(SymbolIdsMemberName).getAsJsonArray()) {

                    var symbolIdString = symbolId.getAsString();

                    if(!symbolIdString.contains(SymbolId.CUSTOMID_VALUE))
                        symbolIds.add(new SymbolId(symbolIdString));
                }

                gebaerdenschrift = new Gebaerdenschrift(gebaerdenschriftLink, symbolIds);

        } catch (IndexOutOfBoundsException e) {
            LOGGER.warn("Der Eintrag " + eintrag.get(Lexikoneintrag.GebaerdenSchriftenMemberName).getAsJsonObject().get(FachbegriffMemberName).getAsString() + " hat keinen Gebärdenschriftlink");
        } catch (NullPointerException e) {
            LOGGER.warn("Der Eintrag " + eintrag.get(IdMemberName).getAsString() + " hat keinen Gebärdenschriftlink");
        }

        String videoLink = eintrag.get(VideoUrlnMemberName).getAsString().trim();

        String[] splittedFachgebiete = eintrag.get(FachgebietMemberName).getAsString().split(",");
        List<String> fachgebiet = Arrays.asList(splittedFachgebiete);

        String[] splittedUrsprung = eintrag.get(UrsprungMemberName).getAsString().split(",");
        List<String> ursprungListe = Arrays.asList(splittedUrsprung);

        String[] splittedVerwendungskontext = eintrag.get(VerwendungskontextMemberName).getAsString().split(",");
        List<String> verwendungskontext = Arrays.asList(splittedVerwendungskontext);

        boolean empfehlung = eintrag.get(EmpfehlungMemberName).getAsString().length() != 0;
        String wortlink = eintrag.get(WiktionaryMemberName).getAsString();
        String bedeutungsnummern = eintrag.get(BedeutungsnummerMemberName).getAsString();
        bedeutungsnummern = bedeutungsnummern.replace(" ", "");
        String wikipedialink = eintrag.get(WikipediaMemberName).getAsString();
        String otherlink = eintrag.get(SonstigesMemberName).getAsString();

        Lexikoneintrag lexikoneintrag = new Lexikoneintrag(id, eintrag.get(FachbegriffMemberName).getAsString().trim(), videoLink, fachgebiet, ursprungListe, verwendungskontext, gebaerdenschrift);
        lexikoneintrag.setEmpfehlung(empfehlung);
        lexikoneintrag.setBedeutungsnummern(bedeutungsnummern);
        lexikoneintrag.setWortlink(wortlink);
        lexikoneintrag.setWikipedialink(wikipedialink);
        lexikoneintrag.setOtherlink(otherlink);
        return lexikoneintrag;
    }
}

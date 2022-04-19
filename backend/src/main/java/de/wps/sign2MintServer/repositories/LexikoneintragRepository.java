package de.wps.sign2MintServer.repositories;

import com.google.gson.*;
import com.google.gson.stream.JsonReader;
import de.wps.sign2MintServer.airtable.model.AirtableRecord;
import de.wps.sign2MintServer.mappers.LexikonEintragMapper;
import de.wps.sign2MintServer.materials.Lexikoneintrag;
import de.wps.sign2MintServer.materials.SymbolId;
import de.wps.sign2MintServer.services.CacheService;
import de.wps.sign2MintServer.services.FrameGrabService;
import de.wps.sign2MintServer.validation.LexikonEintragsJsonValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Repository;

import java.io.*;
import java.lang.invoke.MethodHandles;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Repository
public class LexikoneintragRepository {

    @Value("${api_url}")
    private String delegs_api_url;

    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    private List<Lexikoneintrag> allEintraege;
    private volatile List<SymbolId> symbolIds = new ArrayList<>();

    private final Gson gson = new Gson();
    private final HttpClient httpClient;
    private final CacheService cacheService;
    private final LexikonEintragMapper lexikonEintragMapper;
    private final FrameGrabService frameGrabService;
    private final LexikonEintragsJsonValidator lexikonEintragsJsonValidator;

    public LexikoneintragRepository(HttpClient httpClient, LexikonEintragMapper lexikonEintragMapper, LexikonEintragsJsonValidator lexikonEintragsJsonValidator, FrameGrabService frameGrabService, CacheService cacheService) {

        this.httpClient = httpClient;
        this.cacheService = cacheService;
        this.lexikonEintragMapper = lexikonEintragMapper;
        this.frameGrabService = frameGrabService;
        this.lexikonEintragsJsonValidator = lexikonEintragsJsonValidator;

        readLexikoneintraegeCacheFile();
        readAirtableCacheFile();
        updateSymbolIds();
        countVariants();
        buildThumbnailsForAllVideos(allEintraege); //geht sehr schnell wenn die Bilder vorhanden sind
    }

    @Async
    public synchronized void loadLexikoneintraegeFromApiAsync() {
        LOGGER.info("Starting Asynchronous Task to update Lexikoneintraege by pulling from Delegs API");
        loadLexikoneintraegeFromApi();
        LOGGER.info("Finished Asynchronous Task to update Lexikoneintraege by pulling from Delegs API");
    }

    @Scheduled(cron = "0 */10 * * * *")
    public void loadLexikoneintraegeFromApiAtMidnight() {
        LOGGER.info("Starting Cron Job to update Lexikoneintraege by pulling from Delegs API");
        loadLexikoneintraegeFromApi();
        LOGGER.info("Finished Cron Job to update Lexikoneintraege by pulling from Delegs API");
    }

    private void loadLexikoneintraegeFromApi() {

        var alleLexikonEintraege = getAllLexikonEintraege();
        if (alleLexikonEintraege == null)
            return;

        JsonArray allLexikoneintraege = JsonParser.parseString(alleLexikonEintraege).getAsJsonArray();

        var validatedEintraege = lexikonEintragsJsonValidator.validateJsonElements(allLexikoneintraege);

        List<Lexikoneintrag> apiLexikoneintraege = validatedEintraege.stream()
                .map(JsonElement::getAsJsonObject)
                .map(lexikonEintragMapper::map)
                .collect(Collectors.toList());

        for (Lexikoneintrag apiLexikonEintrag : apiLexikoneintraege) {

            var existingEntry = allEintraege.stream().filter(entry -> entry.getId().equals(apiLexikonEintrag.getId())).findFirst().orElse(null);

            if (!apiLexikonEintrag.equals(existingEntry))
                allEintraege.remove(existingEntry);
            else
                continue;

            var videoLink = apiLexikonEintrag.getVideoLink();
            frameGrabService.getThumbnailForVideo(videoLink);
            allEintraege.add(apiLexikonEintrag);
        }

        countVariants();
        updateSymbolIds();

        var cacheFilePath = cacheService.getLexikoneintraegeCacheFilePath();
        try (FileWriter fileWriter = new FileWriter(cacheFilePath)) {
            try {
                gson.toJson(validatedEintraege, fileWriter);
            } catch (JsonIOException e) {
                e.printStackTrace();
            }

        } catch (IOException e) {
            e.printStackTrace();
        }

        this.allEintraege.clear();
        this.allEintraege.addAll(apiLexikoneintraege);
    }

    public List<Lexikoneintrag> findAll() {
        return allEintraege;
    }

    private void countVariants() {
        for (Lexikoneintrag initalEintrag : allEintraege) {
            for (Lexikoneintrag potentialVariant : allEintraege) {
                if (initalEintrag.getFachbegriff().equals(potentialVariant.getFachbegriff())) {
                    initalEintrag.setVariants(initalEintrag.getVariants() + 1);
                }
            }
        }
    }

    private void readLexikoneintraegeCacheFile() {

        try {
            var cacheFilePath = cacheService.getLexikoneintraegeCacheFilePath();
            JsonReader jsonReader = new JsonReader(new FileReader(cacheFilePath));
            JsonArray parsedJsonArray = JsonParser.parseReader(jsonReader).getAsJsonArray();

            allEintraege = StreamSupport.stream(parsedJsonArray.spliterator(), false)
                    .map(JsonElement::getAsJsonObject)
                    .map(lexikonEintragMapper::map)
                    .collect(Collectors.collectingAndThen(Collectors.toList(), Collections::synchronizedList));

        } catch (FileNotFoundException e) {
            LOGGER.info("LexikoneintraegeCache not found. Using empty list.");
            allEintraege = new ArrayList<>();
        }
    }

    /**
     * Read all airtable records from the cache file
     */
    private void readAirtableCacheFile() {
        var cacheFilePath = cacheService.getAirtableCacheFilePath();
        try (var fileReader = new FileReader(cacheFilePath)) {
            var jsonReader = new JsonReader(fileReader);
            var airtableRecordArray = (AirtableRecord[]) gson.fromJson(jsonReader, AirtableRecord[].class);
            buildSymbolIds(airtableRecordArray);
        } catch (IOException | JsonIOException e) {
            var message = String.format("Failed to read airtable cache. %s", e.getMessage());
            LOGGER.error(message, e);
        }
    }

    private void buildSymbolIds(AirtableRecord[] airtableRecords) {

        var symbolIds = new ArrayList<SymbolId>();

        for (var airtableRecord : airtableRecords) {

            var airtableFields = airtableRecord.getFields();
            var symbolIdString = airtableFields.getSymbolId();

            if (symbolIdString != null) {

                var symbolId = new SymbolId(symbolIdString);
                var symbolKey = airtableFields.getSymbolKey();
                symbolId.setSymbolKey(symbolKey);

                var allophone = airtableFields.getAllophone();

                if (allophone != null)
                    symbolId.setAllophoneFromAirtable(allophone);

                symbolIds.add(symbolId);
            }
        }

        this.symbolIds = symbolIds;
    }


    private String getAllLexikonEintraege() {
        try {

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(delegs_api_url))
                    .timeout(Duration.ofMinutes(15))
                    .header("Content-Type", "application/json")
                    .GET()
                    .build();

            return httpClient.send(request, HttpResponse.BodyHandlers.ofString()).body();


        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Async
    public synchronized void buildThumbnailsForAllVideos(List<Lexikoneintrag> alleEintraege) {

        LOGGER.info("Starting Asynchronous Task to convert Thumbnails if not exsisting!");

        for (Lexikoneintrag lexikonEintrag : alleEintraege) {
            try {
                frameGrabService.getThumbnailForVideo(lexikonEintrag.getVideoLink());
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        LOGGER.info("Ending Asynchronous Task to convert Thumbnails if not exsisting!");
    }

    private void updateSymbolIds() {

        for (var lexikonEintrag : this.allEintraege) {

            var gebaerdenschrift = lexikonEintrag.getGebaerdenschrift();
            var currentSymbolIds = gebaerdenschrift.getSymbolIds();

            for (var symbolId : currentSymbolIds) {

                var symbolIdWithSymbolKey = symbolIds.stream().filter(id -> id.equals(symbolId)).findFirst().orElse(null);
                if (symbolIdWithSymbolKey == null) {
                    var logMessage = String.format("No symbol key found for symbolId %s", symbolId);
                    LOGGER.warn(logMessage);
                    continue;
                }

                var symbolKey = symbolIdWithSymbolKey.getSymbolKey();
                if (symbolKey != null)
                    symbolId.setSymbolKey(symbolKey);

                var symbolAllophone = symbolIdWithSymbolKey.getAllophone();
                if (!symbolAllophone.isEmpty())
                    symbolId.setAllophone(symbolAllophone);
            }
        }
    }

    public List<SymbolId> collectBySymbolKeys(List<String> symbolkeys) {
        return symbolIds.stream().filter(symbolId -> symbolkeys.contains(symbolId.getSymbolKey())).collect(Collectors.toList());
    }
}

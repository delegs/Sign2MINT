package de.wps.sign2MintServer.materials;

import java.text.Collator;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

public class Lexikoneintrag {
    private String id;
    private String fachbegriff;
    private String videoLink;
    private List<String> fachgebiete;
    private List<String> ursprung;
    private List<String> verwendungskontext;
    private String definition;
    private boolean empfehlung;
    private String bedeutungsnummern;
    private String wortlink;
    private String wikipedialink;
    private String otherlink;
    private int variants;
    private Gebaerdenschrift gebaerdenschrift;

    public static final String GebaerdenSchriftenMemberName = "Gebaerdenschrift:";
    public static final String VideoUrlnMemberName = "VideoUrl:";
    public static final String FachgebietMemberName = "Fachgebiet:";
    public static final String UrsprungMemberName = "Ursprung:";
    public static final String VerwendungskontextMemberName = "Verwendungskontext:";
    public static final String EmpfehlungMemberName = "Empfehlung:";
    public static final String WiktionaryMemberName = "Wiktionary:";
    public static final String BedeutungsnummerMemberName = "Bedeutungsnummer:";
    public static final String WikipediaMemberName = "Wikipedia:";
    public static final String SonstigesMemberName = "Sonstiges:";
    public static final String FachbegriffMemberName = "Fachbegriff";
    public static final String GebaerdenschriftUrlMemberName = "Url:";
    public static final String SymbolIdsMemberName = "SymbolIds:";
    public static final String IdMemberName = "Id:";

    public static final Comparator<Lexikoneintrag> LEXIKONEINTRAGSCOMPARATOR = (o1, o2) -> Collator.getInstance(Locale.GERMANY).compare(o1.getFachbegriff(), o2.getFachbegriff());

    // Test Konstruktor
    public Lexikoneintrag() {}

    public Lexikoneintrag(String id, String fachbegriff, String videoLink,
                          List<String> fachgebiete, List<String> ursprung, List<String> verwendungskontext, Gebaerdenschrift gebaerdenschrift) {
        this.id = id;
        this.fachbegriff = fachbegriff;
        this.videoLink = videoLink;
        this.fachgebiete = fachgebiete;
        this.ursprung = ursprung;
        this.verwendungskontext = verwendungskontext;
        this.definition = "";
        this.empfehlung = false;
        this.variants = 0;
        this.gebaerdenschrift = gebaerdenschrift;
    }

    public String getId() {
        return id;
    }

    public String getFachbegriff() {
        return fachbegriff;
    }

    public String getVideoLink() {
        return videoLink;
    }

    public List<String> getFachgebiete() {
        return fachgebiete;
    }

    public List<String> getUrsprung() {
        return ursprung;
    }

    public List<String> getVerwendungskontext() {
        return verwendungskontext;
    }

    public String getDefinition() {
        return definition;
    }

    public boolean getEmpfehlung() {
        return empfehlung;
    }

	public void setId(String id) {
        this.id = id;
    }

    public void setEmpfehlung(boolean empfehlung) {
        this.empfehlung = empfehlung;
    }

    public void setDefinition(String definition) {
        this.definition = definition;
    }

    public String getBedeutungsnummern() {
        return bedeutungsnummern;
    }

    public void setBedeutungsnummern(String bedeutungsnummern) {
        this.bedeutungsnummern = bedeutungsnummern;
    }

    public String getWortlink() {
        return wortlink;
    }

    public void setWortlink(String wortlink) {
        this.wortlink = wortlink;
    }

    public String getWikipedialink() {
        return wikipedialink;
    }

    public void setWikipedialink(String wikipedialink) {
        this.wikipedialink = wikipedialink;
    }

    public String getOtherlink() {
        return otherlink;
    }

    public void setOtherlink(String otherlink) {
        this.otherlink = otherlink;
    }

    public int getVariants() {
        return variants;
    }

    public void setVariants(int variants) {
        this.variants = variants;
    }

    public Gebaerdenschrift getGebaerdenschrift() {
	return gebaerdenschrift;
   }

    public void setGebaerdenschrift(Gebaerdenschrift gebaerdenschrift) {
    	this.gebaerdenschrift = gebaerdenschrift;
    }


	@Override
    public String toString() {
        JsonObject lexikoneintrag = new JsonObject();
        lexikoneintrag.addProperty("id", id);
        lexikoneintrag.addProperty("fachbegriff", fachbegriff);
        lexikoneintrag.addProperty("videoLink", videoLink);
        lexikoneintrag.addProperty("fachgebiet", fachgebiete.toString());
        lexikoneintrag.addProperty("ursprung", ursprung.toString());
        lexikoneintrag.addProperty("verwendungskontext", verwendungskontext.toString());
        lexikoneintrag.addProperty("definition", definition);
        lexikoneintrag.addProperty("empfehlung", empfehlung);
        lexikoneintrag.addProperty("variants", variants);
        lexikoneintrag.addProperty("gebaerdenschrift", new Gson().toJson(gebaerdenschrift));

        return lexikoneintrag.toString();
    }


    public static int calculateDistance(String inputWord, String checkWord) {
        int[][] wordMartix = new int[inputWord.length() + 1][checkWord.length() + 1];

        for (int i = 0; i <= inputWord.length(); i++) {
            wordMartix[i][0] = i;
        }

        for (int j = 0; j <= checkWord.length(); j++) {
            wordMartix[0][j] = j;
        }

        for (int i = 1; i < wordMartix.length; i++) {
            for (int j = 1; j < wordMartix[i].length; j++) {
                if (inputWord.charAt(i - 1) == checkWord.charAt(j - 1)) {
                    wordMartix[i][j] = wordMartix[i - 1][j - 1];
                } else {
                    int minimum = Integer.MAX_VALUE;
                    if ((wordMartix[i - 1][j]) + 1 < minimum) {
                        minimum = (wordMartix[i - 1][j]) + 1;
                    }

                    if ((wordMartix[i][j - 1]) + 1 < minimum) {
                        minimum = (wordMartix[i][j - 1]) + 1;
                    }

                    if ((wordMartix[i - 1][j - 1]) + 1 < minimum) {
                        minimum = (wordMartix[i - 1][j - 1]) + 1;
                    }

                    wordMartix[i][j] = minimum;
                }
            }
        }

        return wordMartix[inputWord.length()][checkWord.length()];
    }

    @Override
    public boolean equals(Object other) {

        var otherEintrag = other instanceof Lexikoneintrag ? (Lexikoneintrag) other : null;

        return otherEintrag != null &&
                this.getId().equals(otherEintrag.getId()) &&
                this.getFachbegriff().equals(otherEintrag.getFachbegriff()) &&
                this.getVideoLink().equals(otherEintrag.getVideoLink()) &&
                this.getFachgebiete().containsAll(otherEintrag.getFachgebiete()) &&
                this.getFachgebiete().size() == otherEintrag.getFachgebiete().size() &&
                this.getUrsprung().containsAll(otherEintrag.getUrsprung()) &&
                this.getUrsprung().size() == otherEintrag.getUrsprung().size() &&
                this.getVerwendungskontext().containsAll(otherEintrag.getVerwendungskontext()) &&
                this.getVerwendungskontext().size() == otherEintrag.getVerwendungskontext().size() &&
                this.getDefinition().equals(otherEintrag.getDefinition()) &&
                this.getEmpfehlung() == otherEintrag.getEmpfehlung() &&
                this.getBedeutungsnummern().equals(otherEintrag.getBedeutungsnummern()) &&
                this.getWortlink().equals(otherEintrag.getWortlink()) &&
                this.getWikipedialink().equals(otherEintrag.getWikipedialink()) &&
                this.getOtherlink().equals(otherEintrag.getOtherlink()) &&
                this.getVariants() == otherEintrag.getVariants() &&
                this.getGebaerdenschrift().equals(otherEintrag.getGebaerdenschrift());
    }
}

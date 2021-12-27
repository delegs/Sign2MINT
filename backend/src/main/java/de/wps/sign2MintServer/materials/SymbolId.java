package de.wps.sign2MintServer.materials;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

public class SymbolId {

    private static final String EMPTY_2_CHARACTER_VALUE = "XX";
    private static final String EMPTY_3_CHARACTER_VALUE = "XXX";
    public static final String EMPTY_SYMBOLID_VALUE = "XX-XX-XXX-XX-XX-XX";
    public static final String CUSTOMID_VALUE = "99";

    // Symbol
    private String kategorie;
    // Fingeranzahl
    private String klassifikation;
    // Handform Kategorie bestehend aus Handformkategorie und Fingeranzahl
    private String symbolGruppe;

    // Form
    private String form;
    // Variante
    private String variante;
    // Bewegung bestehend aus Handform und Variante
    private String bewegung;

    // Füllung
    private String füllung;
    // Rotation
    private String rotation;

    private String symbolId;

    private String symbolKey;

    // Enthälte alle zugehörigen Allophone
    private List<SymbolId> allophone;

    private static final Pattern symbolIdPattern = Pattern.compile("^[X0-9]{2}-[X0-9]{2}-[X0-9]{3}-[X0-9]{2}-[X0-9]{2}-[X0-9]{2}$");

    public SymbolId() {
    	this.symbolKey = "";
    	this.allophone = new ArrayList<>();
    }

    public SymbolId(String symbolId) {

        if(!isValid(symbolId)) {

            var exceptionText = String.format("Invalid symbolId: %s", symbolId);
            throw new IllegalArgumentException(exceptionText);
        }

        this.symbolId = symbolId;
        this.symbolKey = "";
        this.allophone = new ArrayList<>();

        assignParts(symbolId);
    }

    public String getKategorie() {
        return kategorie;
    }

    public void setKategorie(String kategorie) {
        this.kategorie = kategorie;
    }

    public String getKlassifikation() {
        return klassifikation;
    }

    public void setKlassifikation(String klassifikation) {
        this.klassifikation = klassifikation;
    }

    public String getSymbolGruppe() {
        return symbolGruppe;
    }

    public void setSymbolGruppe(String symbolGruppe) {
        this.symbolGruppe = symbolGruppe;
    }

    public String getForm() {
        return form;
    }

    public void setForm(String form) {
        this.form = form;
    }

    public String getVariante() {
        return variante;
    }

    public void setVariante(String variante) {
        this.variante = variante;
    }

    public String getBewegung() {
        return bewegung;
    }

    public void setBewegung(String bewegung) {
        this.bewegung = bewegung;
    }

    public String getFüllung() {
        return füllung;
    }

    public void setFüllung(String füllung) {
        this.füllung = füllung;
    }

    public String getRotation() {
        return rotation;
    }

    public void setRotation(String rotation) {
        this.rotation = rotation;
    }

    public String getSymbolId() {
        return symbolId;
    }

    public void setSymbolId(String symbolId) {
        this.symbolId = symbolId;
    }

    public static Pattern getSymbolIdPattern() {
        return symbolIdPattern;
    }


    public String getSymbolKey() {
		return symbolKey;
	}

	public void setSymbolKey(String symbolKey) {
		this.symbolKey = symbolKey;
	}

	public List<SymbolId> getAllophone() {
		return allophone;
	}

	public void setAllophone(List<SymbolId> allophone) {
		this.allophone = allophone;
	}

	/**
	 * Bekommt eine String in Form von SymbolId-String die durch
	 * Semikolons getrennt sind (z.B.: 01-05-018-01-01-01;
	 * 01-05-054-01-01-01; 01-05-055-01-01-01) als Parameter von
	 * Airtable übergeben. Daraus wird eine Liste mit SymbolIds
	 * generiert die die Allophone darstellen.
	 *
	 * @param airtableAllophone SymbolIds als String
	 * */
	public void setAllophoneFromAirtable(String airtableAllophone) {

		var splitAirtableAllophone = airtableAllophone.split(";");
		Arrays.stream(splitAirtableAllophone).forEach(airtableAllophon -> {
			if (airtableAllophon != null) {
                var trimmedAllophon = airtableAllophon.trim();
                var allophonWithoutFillAndRotation = trimmedAllophon.substring(0,trimmedAllophon.length() -5) + "XX-XX";
			    var symbolId = new SymbolId(allophonWithoutFillAndRotation);
                if(!this.allophone.contains(symbolId))
			        this.allophone.add(symbolId);
			}
		});
	}

	private void assignParts(String symbolId) {

        var parts = symbolId.split("-");

        kategorie = parts[0];
        klassifikation = parts[1];
        symbolGruppe = String.format("%s-%s", kategorie, klassifikation);

        form = parts[2];
        variante = parts[3];
        bewegung = String.format("%s-%s", form, variante);

        füllung = parts[4];
        rotation = parts[5];
    }

    public static boolean isValid(String symbolId) {
        var matcher = symbolIdPattern.matcher(symbolId);
        return matcher.matches();
    }

    public boolean matches(SymbolId other) {

        var matchesKategorie = matchesProperty(kategorie, other.kategorie);
        var matchesKlassifikation = matchesProperty(klassifikation, other.klassifikation);

        var matchesForm = matchesProperty(form, other.form);
        var matchesVariante = matchesProperty(variante, other.variante);

        var matchesFüllung = matchesProperty(füllung, other.füllung);
        var matchesRotation = matchesProperty(rotation, other.rotation);

        return matchesKategorie && matchesKlassifikation && matchesForm && matchesVariante && matchesFüllung && matchesRotation;
    }


    private boolean matchesProperty(String property, String otherProperty) {

        return  otherProperty.equals(EMPTY_2_CHARACTER_VALUE) ||
                otherProperty.equals(EMPTY_3_CHARACTER_VALUE) ||
                otherProperty.equals(property);
    }

    public static String padSymbolId(String symbolId) {

        var templateLength = EMPTY_SYMBOLID_VALUE.length();
        var symbolidLength = symbolId.length();
        return symbolId + EMPTY_SYMBOLID_VALUE.substring(symbolidLength, templateLength);
    }

    @Override
    public String toString() {
        return symbolId;
    }

    @Override
    public boolean equals(Object other) {

        if(!(other instanceof SymbolId))
            return false;

        var otherSymbolId = (SymbolId) other;
        return this.symbolId.equals(otherSymbolId.symbolId);
    }

    @Override
    public int hashCode()
    {
        return symbolId.hashCode();
    }
}

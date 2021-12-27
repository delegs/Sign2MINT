package de.wps.sign2MintServer.airtable.model;

import com.google.gson.annotations.SerializedName;

public class AirtableFields {

    @SerializedName(value = "Symbol ID")
    private String symbolId;

    @SerializedName(value = "Anzahl (Sign2MINT)")
    private String sign2MintCount;
    
    @SerializedName(value = "Anzahl (Sign2Mint) Ohne Rotation")
    private String sign2MintCountWithoutRotation;

    @SerializedName(value = "Anzahl (Sign2Mint) Ohne Fill und Rotation")
    private String sign2MintCountWithoutFillAndRotation;
    
    @SerializedName(value = "Symbol Key")
    private String symbolKey;
    
    @SerializedName(value = "Allophone (Symbol-ID)")
    private String allophone;

    public AirtableFields() {}

    public String getSymbolId() {
        return symbolId;
    }

    public void setSymbolId(String symbolId) {
        this.symbolId = symbolId;
    }

    public String getSign2MintCount() {
        return sign2MintCount;
    }

    public void setSign2MintCount(String sign2MintCount) {
        this.sign2MintCount = sign2MintCount;
    }
    
    public String getSign2MintCountWithoutRotation() {
		return sign2MintCountWithoutRotation;
	}

	public void setSign2MintCountWithoutRotation(String sign2MintCountWithoutRotation) {
		this.sign2MintCountWithoutRotation = sign2MintCountWithoutRotation;
	}

	public String getSign2MintCountWithoutFillAndRotation() {
		return sign2MintCountWithoutFillAndRotation;
	}

	public void setSign2MintCountWithoutFillAndRotation(String sign2MintCountWithoutFillAndRotation) {
		this.sign2MintCountWithoutFillAndRotation = sign2MintCountWithoutFillAndRotation;
	}

	public String getSymbolKey() {
		return symbolKey;
	}

	public void setSymbolKey(String symbolKey) {
		this.symbolKey = symbolKey;
	}

	public String getAllophone() {
		return allophone;
	}

	public void setAllophone(String allophoneSymbolId) {
		this.allophone= allophoneSymbolId;
	}


	public boolean areRequiredFieldsValid() {

        var symbolIdNotEmpty = symbolId != null && !symbolId.isEmpty();
        var symbolKeyNotEmpty = symbolKey != null && !symbolKey.isEmpty();
        return symbolIdNotEmpty && symbolKeyNotEmpty;
    }
}

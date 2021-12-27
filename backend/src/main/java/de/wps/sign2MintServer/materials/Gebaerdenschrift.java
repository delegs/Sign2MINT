package de.wps.sign2MintServer.materials;

import java.util.List;

public class Gebaerdenschrift {
	
	private final String url;
	private final List<SymbolId> symbolIds;

	
	public Gebaerdenschrift(String url, List<SymbolId> symbolIds) {
		this.url = url;
		this.symbolIds = symbolIds;
	}

	public String getUrl() {
		return url;
	}

	public List<SymbolId> getSymbolIds() {
		return symbolIds;
	}

	@Override
	public boolean equals(Object other) {

		var otherGebaerdenschrift = other instanceof Gebaerdenschrift ? (Gebaerdenschrift) other : null;

		return  otherGebaerdenschrift != null &&
				this.getUrl().equals(otherGebaerdenschrift.getUrl()) &&
				this.getSymbolIds().size() == otherGebaerdenschrift.getSymbolIds().size() &&
				this.getSymbolIds().containsAll(otherGebaerdenschrift.getSymbolIds());

	}
}

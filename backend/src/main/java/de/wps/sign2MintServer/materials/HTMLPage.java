package de.wps.sign2MintServer.materials;

import com.google.gson.JsonObject;

public class HTMLPage {
	private final String content;

	public HTMLPage(String content) {
		super();
		this.content = content;
	}

	public String getContent() {
		return content;
	}

	@Override
	public String toString() {
		JsonObject hTMLPage = new JsonObject();
		hTMLPage.addProperty("content", content);
		return hTMLPage.toString();
	}
}

package de.wps.sign2MintServer.airtable.model;

public class AirtableRecord {
	
	private String id;
	private AirtableFields fields;

	public AirtableRecord() {

	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public AirtableFields getFields() {
		return fields;
	}

//	public void setFields(AirtableFields fields) {
//		this.fields = fields;
//	}
//
//	public boolean isValidRecord() {
//		return fields != null && fields.areRequiredFieldsValid();
//	}
}

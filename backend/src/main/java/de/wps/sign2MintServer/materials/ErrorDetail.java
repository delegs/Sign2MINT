package de.wps.sign2MintServer.materials;

public class ErrorDetail {
	
	private final int status;
	private final String message;

	public ErrorDetail(int status, String message) {
		this.status = status;
		this.message = message;
	}

	public int getStatus() {
		return status;
	}

	public String getMessage() {
		return message;
	}
} 

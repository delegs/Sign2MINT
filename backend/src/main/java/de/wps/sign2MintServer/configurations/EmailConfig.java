package de.wps.sign2MintServer.configurations;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import de.wps.sign2MintServer.services.EMailService;
import de.wps.sign2MintServer.services.impl.EMailServiceImpl;

@Configuration
public class EmailConfig {
	
	private final String MAILER = "sign2mint.mailer.";
	private final String SMTP = MAILER + "smtp.";
	private final String RECIPIENTS = MAILER + "recipients.";
		
	@Value("${" + RECIPIENTS + "s2mintler}")
	private String s2mintler;
	
	@Value("${" + RECIPIENTS + "teamDelegs}")
	private String teamDelegs;
	
	@Value("${" + SMTP + "smtpHost}")
	private String smtpHost;
	 
	@Value("${" + SMTP + "smtpUser}")
	private String smtpUser;
	 
	@Value("${" + SMTP + "smtpPassword}")
	private String smtpPassword;
	
	@Value("${" + MAILER + "sender}")
	private String sender;
	
	@Value("${" + MAILER + "senderName}")
	private String senderName;
	
	@Bean
	public EMailService mailerService() {
		return new EMailServiceImpl(s2mintler, smtpHost, smtpUser, smtpPassword, sender, senderName);
	}
	
}

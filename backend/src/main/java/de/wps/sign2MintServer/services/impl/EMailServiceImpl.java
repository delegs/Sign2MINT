package de.wps.sign2MintServer.services.impl;

import com.sun.mail.smtp.SMTPTransport;
import com.sun.mail.util.MailConnectException;
import de.wps.sign2MintServer.services.EMailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMessage.RecipientType;
import java.io.UnsupportedEncodingException;
import java.lang.invoke.MethodHandles;
import java.util.Date;
import java.util.Properties;

public class EMailServiceImpl implements EMailService {

    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    // SMTP
    private final String smtpHost;
    private final String smtpUser;
    private final String smtpPassword;
    // Recipients
    private final String s2mintler;
    // Sender
    private final String sender;
    private final String senderName;

    public EMailServiceImpl(String s2mintler, String smtpHost, String smtpUser, String smtpPassword, String sender,
                            String senderName) {

        this.s2mintler = s2mintler;
        this.smtpHost = smtpHost;
        this.smtpUser = smtpUser;
        this.smtpPassword = smtpPassword;
        this.sender = sender;
        this.senderName = senderName;
    }

    private Session getSession() {

        Properties properties = System.getProperties();
        properties.setProperty("mail.transport.protocol", "smtps");
        properties.setProperty("mail.host", smtpHost);
        properties.setProperty("mail.smtps.auth", "true");
        properties.setProperty("mail.smtps.port", "465");
        properties.setProperty("mail.smtps.ssl.trust", smtpHost);
        properties.setProperty("mail.smtps.ssl.enable", "true");
        properties.setProperty("mail.smtps.ssl.protocols", "TLSv1.2");

        if (System.getSecurityManager() == null) {
            return Session.getInstance(properties);
        }
        return Session.getDefaultInstance(properties);
    }

    private void sendMail(String recipient, String[] ccRecipients, String subject, String mailContent)
            throws MessagingException, UnsupportedEncodingException {

        Session session = getSession();
        MimeMessage message = new MimeMessage(session);

        message.setFrom(new InternetAddress(sender, senderName));
        message.addRecipient(RecipientType.TO, new InternetAddress(recipient));
        if (ccRecipients != null) {
            for (String ccRecipient : ccRecipients) {
                message.addRecipient(RecipientType.CC, new InternetAddress(ccRecipient));
            }
        }
        message.setSubject(subject);
        message.setSentDate(new Date());
        message.setContent(mailContent, "text/html; charset=utf-8");

        message.saveChanges();

        SMTPTransport transport = (SMTPTransport) session.getTransport("smtps");
        transport.connect(smtpHost, smtpUser, smtpPassword);
        transport.sendMessage(message, message.getAllRecipients());
    }

    private void sendMail(String recipient, String subject, String mailContent) throws MessagingException, UnsupportedEncodingException {
        sendMail(recipient, new String[0], subject, mailContent);
    }

    @Override
    public void sendContactMail(String contactMail, String content) throws MailNotSendException, MailServerUnreachableException {
        try {
            String prelude = "Kontakt-Mail: " + contactMail + "\n\n";
            String[] cc = {};
            String mailHeader = "Ein Benutzer hat Kontakt aufgenommen.";
            sendMail(s2mintler, cc, mailHeader, prelude + "Inhalt:\n" + content);
        } catch (MailConnectException e) {
            throw new MailServerUnreachableException(e.getHost() + "nicht erreichbar", e);
        } catch (MessagingException | UnsupportedEncodingException e) {
            LOGGER.warn("Sending of mail failed");
            throw new MailNotSendException("Sending of contact mail failed");
        }
    }

    @Override
    public boolean sendEmail(String subject, String content) {
        try {
            sendMail(s2mintler, subject, content);
            return true;
        } catch (UnsupportedEncodingException | MessagingException e) {
            e.printStackTrace();
            return false;
        }
    }
}

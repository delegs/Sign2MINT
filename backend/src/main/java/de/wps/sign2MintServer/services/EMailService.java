package de.wps.sign2MintServer.services;

public interface EMailService {

    void sendContactMail(String contactMail, String content) throws MailNotSendException, MailServerUnreachableException;

    boolean sendEmail(String subject, String content);

    class MailNotSendException extends Exception {
        private static final long serialVersionUID = 6450036743599383125L;

        public MailNotSendException(String errorMessage) {
            super(errorMessage);
        }
    }

	class MailServerUnreachableException extends Exception {
        public MailServerUnreachableException(String errorMessage, Exception e) {
            super(errorMessage, e);
        }
    }
}

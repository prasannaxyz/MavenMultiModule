package com.srinergi.Mailing.model;

import javax.mail.*;
import javax.mail.internet.*;
import javax.mail.Authenticator;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.util.Properties;

@Service("simpleMail")
@Scope("prototype")
public class SimpleMail implements ISimpleMail {
	
	private class SMTPAuthenticator extends javax.mail.Authenticator {
		public PasswordAuthentication getPasswordAuthentication() {
			Properties props=new Properties();
			try {
				props.load(getClass().getClassLoader().getResourceAsStream(
						"properties/mail.properties"));
			} catch (IOException e) {
				e.printStackTrace();
			}
			String username = props.getProperty("SMTP_AUTH_USER");
			String password = props.getProperty("SMTP_AUTH_PWD");
			return new PasswordAuthentication(username, password);
		}
	}
	
	public void sendTextMail(String email,String subject,String content) {
		
		Properties props = new Properties();
		try {
			props.load(getClass().getClassLoader().getResourceAsStream(
					"properties/mail.properties"));
		} catch (IOException e1) {
			e1.printStackTrace();
		}

		Authenticator auth = new SMTPAuthenticator();
		Session mailSession = Session.getDefaultInstance(props, auth);

		MimeMessage message = new MimeMessage(mailSession);

		Multipart multipart = new MimeMultipart("alternative");

		BodyPart part1 = new MimeBodyPart();
		try {
			Transport transport = mailSession.getTransport();
			part1.setContent(content,"text/html");
			multipart.addBodyPart(part1);

			message.setContent(multipart);
			message.setFrom(new InternetAddress("Srinergi_Healthcare"));
			message.setSubject(subject);
			message.addRecipient(Message.RecipientType.TO, new InternetAddress(
					email));

			transport.connect();
			transport.sendMessage(message,
					message.getRecipients(Message.RecipientType.TO));
			transport.close();
		} catch (MessagingException e) {
			e.printStackTrace();
		}

	}
	
	public static void main(String[] args) throws Exception {
		String subject="This is the subject";
		String content="Hello <b>Firstname</b><br/> <b>Congratulations! Your registration has been approved.</b><br/>Your login details are<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;<b>Username:<*********></b><br/><br/>Click the link below to enter into  your account<br/><a href='www.cloudbees.com.32=-frerer/reg'>www.cloudbees.com.32=-frerer/reg</a><br/><br/><br/><u>Note:</u> Your <b>password</b> will be sent in the subsequent email for security reason.<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This is an automatically generated email - please do not reply to it.<br/><br/><br/><br/><br/><br/>";
		new SimpleMail().sendTextMail("prasanna.adk@gmail.com",subject,content);
	}
	
}

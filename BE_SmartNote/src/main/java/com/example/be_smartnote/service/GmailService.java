package com.example.be_smartnote.service;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.GmailScopes;
import com.google.api.services.gmail.model.*;
import javax.activation.DataHandler;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import org.springframework.stereotype.Service;
import java.io.*;
import java.security.GeneralSecurityException;
import java.util.*;
import javax.mail.Message.RecipientType;
import java.util.Base64;
import com.google.api.client.auth.oauth2.AuthorizationCodeFlow;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import javax.mail.*;
import javax.mail.internet.*;
import java.util.Properties;

@Service
public class GmailService {

    private static final String APPLICATION_NAME = "Gmail API Java Quickstart";
    private static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();
    private static final String TOKENS_DIRECTORY_PATH = "tokens";
    private static final List<String> SCOPES = Collections.singletonList(GmailScopes.GMAIL_SEND);

    // Lấy credentials cho người dùng
    private static Credential getCredentials(final NetHttpTransport HTTP_TRANSPORT) throws IOException {
        InputStream in = GmailService.class.getResourceAsStream("/credentials.json");
        GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(in));
        GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(
                HTTP_TRANSPORT, JSON_FACTORY, clientSecrets, SCOPES)
                .setDataStoreFactory(new FileDataStoreFactory(new java.io.File(TOKENS_DIRECTORY_PATH)))
                .setAccessType("offline")
                .build();
        LocalServerReceiver receiver = new LocalServerReceiver.Builder().setPort(8888).build();
        return new AuthorizationCodeInstalledApp(flow, receiver).authorize("user");
    }

    // Lấy dịch vụ Gmail
    public static Gmail getGmailService() throws IOException, GeneralSecurityException {
        final NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
        Credential credential = getCredentials(HTTP_TRANSPORT);
        return new Gmail.Builder(HTTP_TRANSPORT, JSON_FACTORY, credential)
                .setApplicationName(APPLICATION_NAME)
                .build();
    }

    // Hàm gửi email
    public void sendEmail(String to, String subject, String body) throws Exception {
        Gmail service = getGmailService();
        MimeMessage email = createEmail(to, subject, body);
        sendMessage(service, "me", email);
    }

    // Tạo email dưới dạng MimeMessage
    private MimeMessage createEmail(String to, String subject, String bodyText) throws MessagingException {
        Properties props = new Properties();
        Session session = Session.getDefaultInstance(props, null);
        MimeMessage email = new MimeMessage(session);

        email.setFrom(new InternetAddress("your-email@gmail.com"));
        email.addRecipient(Message.RecipientType.TO, new InternetAddress(to));  // Đảm bảo sử dụng RecipientType.TO
        email.setSubject(subject);
        email.setText(bodyText);

        return email;
    }

    // Gửi email qua Gmail API
    private void sendMessage(Gmail service, String userId, MimeMessage email) throws MessagingException, IOException {
        // Tạo Message với MimeMessage
        com.google.api.services.gmail.model.Message message = createMessageWithEmail(email);
        service.users().messages().send(userId, message).execute();
    }

    // Tạo Message từ MimeMessage và mã hóa
    private com.google.api.services.gmail.model.Message createMessageWithEmail(MimeMessage email) throws MessagingException, IOException {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        email.writeTo(byteArrayOutputStream);
        byte[] bytes = byteArrayOutputStream.toByteArray();
        String encodedEmail = Base64.getUrlEncoder().encodeToString(bytes);

        // Sử dụng Gmail API's Message class thay vì Message của JavaMail
        com.google.api.services.gmail.model.Message message = new com.google.api.services.gmail.model.Message();
        message.setRaw(encodedEmail);
        return message;
    }
}

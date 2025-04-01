package com.example.be_smartnote.service;

import javax.mail.*;
import javax.mail.internet.*;
import java.util.Properties;

public class EmailSender {

    public static void sendEmail(String to, String subject, String bodyText) throws MessagingException {
        // Thiết lập các thuộc tính cho phiên làm việc (session)
        Properties properties = new Properties();
        properties.put("mail.smtp.host", "smtp.gmail.com");  // Địa chỉ SMTP server (ví dụ Gmail)
        properties.put("mail.smtp.port", "587");
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");

        // Cấu hình phiên làm việc (session)
        Session session = Session.getInstance(properties, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                // Cung cấp thông tin xác thực
                return new PasswordAuthentication("your-email@gmail.com", "your-email-password");
            }
        });

        // Tạo đối tượng MimeMessage thay vì Message (vì Message là trừu tượng)
        MimeMessage message = new MimeMessage(session);

        // Cài đặt thông tin người gửi
        message.setFrom(new InternetAddress("your-email@gmail.com"));
        // Cài đặt người nhận
        message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
        // Cài đặt tiêu đề email
        message.setSubject(subject);
        // Cài đặt nội dung email
        message.setText(bodyText);

        // Gửi email
        Transport.send(message);
    }

    public static void main(String[] args) {
        try {
            // Gửi email
            sendEmail("recipient@example.com", "Test Email Subject", "This is the body of the email.");
            System.out.println("Email sent successfully!");
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}

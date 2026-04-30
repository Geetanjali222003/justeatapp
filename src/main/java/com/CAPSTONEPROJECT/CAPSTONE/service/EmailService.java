package com.CAPSTONEPROJECT.CAPSTONE.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtp(String email, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("justeatapp111@gmail.com");
        message.setTo(email);
        message.setSubject("Your OTP Verification Code");
        message.setText(
            "Hello,\n\n" +
            "Your OTP verification code is: " + otp + "\n\n" +
            "This code is valid for 5 minutes.\n\n" +
            "If you did not request this code, please ignore this email.\n\n" +
            "Thank you,\nCapstone App Team"
        );

        mailSender.send(message);
    }

    /**
     * Send OTP for password reset
     */
    public void sendPasswordResetOtp(String email, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("justeatapp111@gmail.com");
        message.setTo(email);
        message.setSubject("Password Reset OTP");
        message.setText(
            "Hello,\n\n" +
            "You have requested to reset your password.\n\n" +
            "Your password reset OTP is: " + otp + "\n\n" +
            "This code is valid for 5 minutes.\n\n" +
            "If you did not request this, please ignore this email and your password will remain unchanged.\n\n" +
            "Thank you,\nCapstone App Team"
        );

        mailSender.send(message);
    }
}
package com.example.be_smartnote.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticationResponse {
    Long userId;
    String token;
    Date expiryTime;
    String userName;
    String email;
    boolean authenticated;
}

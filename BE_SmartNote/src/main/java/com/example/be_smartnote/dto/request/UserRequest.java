package com.example.be_smartnote.dto.request;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserRequest {
    String fullName;
    String email;
    String password;
    String avatarUrl;
    String provider;

}

package com.example.be_smartnote.dto.request;

import com.example.be_smartnote.entities.Role;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreateRequest {
    String fullName;
    String email;
    String password;
    String avatar;
    String provider;
    Role role;
}

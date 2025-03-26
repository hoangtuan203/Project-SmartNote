package com.example.be_smartnote.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponseWrapper {
    long totalPages;
    long totalElements;
    List<UserResponse> users;
}

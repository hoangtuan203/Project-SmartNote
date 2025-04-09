package com.example.be_smartnote.mapper;


import com.example.be_smartnote.dto.request.UserCreateRequest;
import com.example.be_smartnote.dto.response.UserResponse;
import com.example.be_smartnote.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreateRequest request);
    @Mapping(source = "id", target = "userId")
    UserResponse toUserResponse(User user);
}



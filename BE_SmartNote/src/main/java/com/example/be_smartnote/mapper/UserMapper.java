package com.example.be_smartnote.mapper;


import com.example.be_smartnote.dto.request.UserRequest;
import com.example.be_smartnote.dto.response.UserResponse;
import com.example.be_smartnote.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserRequest request);
    @Mapping(source = "id", target = "userId")
    UserResponse toUserResponse(User user);
}



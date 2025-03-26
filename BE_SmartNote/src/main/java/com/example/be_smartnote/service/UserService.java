package com.example.be_smartnote.service;

import com.example.be_smartnote.dto.request.UserRequest;
import com.example.be_smartnote.dto.response.TaskResponse;
import com.example.be_smartnote.dto.response.TaskResponseWrapper;
import com.example.be_smartnote.dto.response.UserResponse;
import com.example.be_smartnote.dto.response.UserResponseWrapper;
import com.example.be_smartnote.entities.Task;
import com.example.be_smartnote.entities.User;
import com.example.be_smartnote.exception.AppException;
import com.example.be_smartnote.exception.ErrorCode;
import com.example.be_smartnote.mapper.UserMapper;
import com.example.be_smartnote.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserService(PasswordEncoder passwordEncoder, UserRepository userRepository, UserMapper userMapper) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    public UserResponseWrapper getAllUser(Pageable pageable) {
        Page<User> users = userRepository.findAllByPageable(pageable);
        Page<UserResponse> userResponse = users.map(userMapper::toUserResponse);
        return new UserResponseWrapper(
                userResponse.getTotalPages(),
                userResponse.getTotalElements(),
                userResponse.getContent()
        );
    }

    public UserResponse createUser(UserRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new AppException(ErrorCode.EMAIL_IS_EXISTED);
        }

        User newUser = userMapper.toUser(request);
        newUser.setFullName(request.getFullName());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword())); // Sửa lỗi này

        userRepository.save(newUser);

        return userMapper.toUserResponse(newUser);
    }

    public UserResponse getUserById(Long userId){
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return UserResponse.builder()
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .password(user.getPassword())
                .avatarUrl(user.getAvatarUrl())
                .provider(user.getProvider())
                .build();
    }
}

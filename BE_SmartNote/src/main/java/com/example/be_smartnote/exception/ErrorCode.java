package com.example.be_smartnote.exception;


import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    TOUR_NOT_EXITED(1001, "Tour not existed", HttpStatus.NOT_FOUND),
    //HttpStatus.FORBIDDEN là lỗi 403 không có quyền truy cập
    UNAUTHENTICATED(1002, "You do no have permission", HttpStatus.FORBIDDEN),
    EMAIL_NOT_EXISTED(1003, "Email not exited", HttpStatus.NOT_FOUND),
    USER_EXISTS(1004,"User exited", HttpStatus.BAD_REQUEST),
    PASSWORD_TOO_SHORT(1005, "Password must be at least 6 characters long", HttpStatus.BAD_REQUEST),
    CUSTOMER_NOT_EXIST(1005, "Customer not exits", HttpStatus.BAD_REQUEST),
    USER_OR_PASSWORD_WRONG(1006, "User or password wrong", HttpStatus.BAD_REQUEST),
    OAUTH_ERROR(1007, "Oauth2 invalid", HttpStatus.BAD_REQUEST),
    USER_ALREADY_VERIFIED(1008, "User already verified", HttpStatus.BAD_REQUEST),
    INVALID_TOKEN(1009, "Invalid token", HttpStatus.BAD_REQUEST),
    USER_IS_BLOCKED(1010, "User blocked", HttpStatus.BAD_REQUEST),
    EMAIL_IS_EXISTED(1011, "Email already existed", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1012, "User not existed", HttpStatus.BAD_REQUEST),

    ;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}

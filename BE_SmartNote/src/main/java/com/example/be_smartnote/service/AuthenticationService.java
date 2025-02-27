package com.example.be_smartnote.service;

import com.example.be_smartnote.dto.request.AuthenticationRequest;
import com.example.be_smartnote.dto.response.AuthenticationResponse;
import com.example.be_smartnote.entities.User;
import com.example.be_smartnote.exception.AppException;
import com.example.be_smartnote.exception.ErrorCode;
import com.example.be_smartnote.repository.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Slf4j
@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthenticationService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Value("${jwt.signerKey}")
    protected String signerKey;

    @NonFinal
    protected final String GRANT_TYPE = "authorization_code";

    public record TokenInfo(String token, Date expiryDate) {
    }

    //generate token
    public TokenInfo generateToken(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        Date issueTime = new Date();
        Date expireTime = new Date(Instant.ofEpochMilli(issueTime.getTime()).plus(2, ChronoUnit.HOURS).toEpochMilli());

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getFullName())
                .issuer("hoangtuan.com")
                .issueTime(issueTime)
                .expirationTime(expireTime)
                .jwtID(UUID.randomUUID().toString())
                .claim("user_id", user.getId())
                .claim("username", user.getFullName())
                .claim("email", user.getEmail())
                .build();

        JWSObject jwsObject = new JWSObject(header, new Payload(jwtClaimsSet.toJSONObject()));

        try {
            jwsObject.sign(new MACSigner(signerKey.getBytes()));
            return new TokenInfo(jwsObject.serialize(), expireTime);
        } catch (JOSEException e) {
            log.error("cannot create token", e);
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }

    //build scope
    private String buildScope(User user) {
        StringJoiner stringJoiner = new StringJoiner("");

        return stringJoiner.toString();

    }

    //decode token
    public Map<String, Object> decodeToken(String token) throws Exception {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        for (GrantedAuthority grantedAuthority : authentication.getAuthorities()) {
            log.info(grantedAuthority.getAuthority());
        }

        try {
            SignedJWT signedJWT = SignedJWT.parse(token);

            JWSVerifier jwsVerifier = new MACVerifier(signerKey.getBytes());
            if (!signedJWT.verify(jwsVerifier)) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }

            JWTClaimsSet claimsSet = signedJWT.getJWTClaimsSet();

            Map<String, Object> tokenDetail = new HashMap<>();
            tokenDetail.put("user_id", claimsSet.getClaim("user_id"));
            tokenDetail.put("username", claimsSet.getClaim("username"));
            tokenDetail.put("expiration_time", claimsSet.getExpirationTime());
            tokenDetail.put("issue_time", claimsSet.getIssueTime());

            log.info("token detail : {}", tokenDetail);
            return tokenDetail;

        } catch (Exception e) {
            throw new Exception(e);
        }
    }

    //verify token
    public SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(signerKey.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expireTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        var verified = signedJWT.verify(verifier);

        if (!verified && expireTime.after(new Date())) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        return signedJWT;

    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        //kiem tra user ton tai
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_NOT_EXISTED));

        //ma hoa password
        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());

        var userId = user.getId();
        var fullName = user.getFullName();
        var email = user.getEmail();
        var token = generateToken(user);

        //tra ve ket qua new login thanh cong
        return AuthenticationResponse.builder()
                .token(token.token)
                .expiryTime(token.expiryDate())
                .userId(userId)
                .userName(fullName)
                .email(email)
                .authenticated(true)
                .build();

    }
}

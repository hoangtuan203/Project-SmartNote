package com.example.be_smartnote.service;

import com.example.be_smartnote.dto.request.AuthenticationRequest;
import com.example.be_smartnote.dto.request.RefreshRequest;
import com.example.be_smartnote.dto.response.AuthenticationResponse;
import com.example.be_smartnote.dto.response.InviteLinkResponse;
import com.example.be_smartnote.dto.response.RefreshResponse;
import com.example.be_smartnote.entities.*;
import com.example.be_smartnote.exception.AppException;
import com.example.be_smartnote.exception.ErrorCode;
import com.example.be_smartnote.repository.InvalidatedTokenRepository;
import com.example.be_smartnote.repository.InviteTokenRepository;
import com.example.be_smartnote.repository.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.text.ParseException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Slf4j
@Service
public class AuthenticationService {
    private final InvalidatedTokenRepository invalidatedTokenRepository;
    private final InviteTokenRepository inviteTokenRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final InviteService inviteService;

    public AuthenticationService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                                 InviteTokenRepository inviteTokenRepository, InviteService inviteService,
                                 InvalidatedTokenRepository invalidatedTokenRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.inviteTokenRepository = inviteTokenRepository;
        this.inviteService = inviteService;
        this.invalidatedTokenRepository = invalidatedTokenRepository;
    }

    @Value("${jwt.signerKey}")
    protected String signerKey;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String GOOGLE_CLIENT_ID;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String GOOGLE_CLIENT_SECRET;

    @Value("${spring.security.oauth2.client.registration.facebook.client-id}")
    private String FACEBOOK_CLIENT_ID;

    @Value("${spring.security.oauth2.client.registration.facebook.client-secret}")
    private String FACEBOOK_CLIENT_SECRET;

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
                .claim("role", user.getRole())
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
            tokenDetail.put("email", claimsSet.getClaim("email"));
            tokenDetail.put("role", claimsSet.getClaim("role"));
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


    //refresh Token
    public RefreshResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException {
        var signedJWT = verifyToken(request.getToken(), true);
        var jit = signedJWT.getJWTClaimsSet().getJWTID();
        var expireTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        InvalidatedToken invalidatedToken =
                InvalidatedToken.builder().id(jit).expiryTime(expireTime).build();

        invalidatedTokenRepository.save(invalidatedToken);
        var email = signedJWT.getJWTClaimsSet().getStringClaim("email");
        var user = userRepository.findByEmail(email).orElseThrow(
                ()-> new AppException(ErrorCode.USER_NOT_EXISTED)
        );
        var token = generateToken(user);
        return RefreshResponse.builder().token(token.token()).authenticated(true).build();
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


    //login google, facebook
    public ResponseEntity<?> authenticateWithGoogle(String code) {
        if (code == null) {
            return ResponseEntity.badRequest().body("No code provided");
        }

        try {
            String accessToken = getAccessTokenFromGoogle(code);
            Map<String, Object> userInfo = getUserInfoFromGoogle(accessToken);
            return handleOAuth2User(userInfo, "google", accessToken);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error during Google login: " + e.getMessage());
        }
    }

    public ResponseEntity<?> authenticateWithFacebook(String code) {
        if (code == null) {
            return ResponseEntity.badRequest().body("No code provided");
        }

        try {
            String accessToken = getAccessTokenFromFacebook(code);
            Map<String, Object> userInfo = getUserInfoFromFacebook(accessToken);
            return handleOAuth2User(userInfo, "facebook", accessToken);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error during Facebook login: " + e.getMessage());
        }
    }

    private ResponseEntity<?> handleOAuth2User(Map<String, Object> userInfo, String provider, String accessToken) {
        String email = (String) userInfo.get("email");
        String name = (String) userInfo.get("name");
        String picture = (String) userInfo.get("picture");

        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isPresent()) {
            User user = existingUser.get();

            // Cập nhật email của người dùng
            user.setEmail(email);
            userRepository.save(user); // Lưu lại thông tin người dùng với email cập nhật

            InviteToken inviteToken = inviteTokenRepository.findLatestInviteToken();
            inviteToken.setEmail(email);
            inviteToken.setUser(user); // Lưu userId vào InviteToken

            inviteTokenRepository.save(inviteToken);

            Long userId = user.getId(); // Lấy userId của người dùng mới
            InviteLinkResponse inviteLinkResponse = inviteService.generateInviteLink(user.getRole(), null, null, userId); // Gửi userId vào generateInviteLink

            AuthenticationService.TokenInfo tokenInfo = generateToken(user);
            return ResponseEntity.ok(Map.of(
                    "userId", user.getId(),
                    "token", tokenInfo.token(),
                    "accessToken", accessToken,
                    "expiryTime", tokenInfo.expiryDate(),
                    "email", email,
                    "name", user.getFullName(),
                    "picture", picture
            ));
        }

        User newUser = new User();
        newUser.setFullName(name);
        newUser.setPassword("oauth2_default_password_" + provider);
        newUser.setEmail(email); // Cập nhật email
        newUser.setProvider(provider);
        newUser.setAvatarUrl(picture);
        newUser.setRole(Role.FULL_ACCESS);
        User savedUser = userRepository.save(newUser);

        // Lấy và cập nhật InviteToken
        InviteToken inviteToken = inviteTokenRepository.findLatestInviteToken();
        inviteToken.setEmail(email);
        inviteToken.setUser(savedUser); // Lưu userId vào InviteToken

        Long userId = savedUser.getId(); // Lấy userId của người dùng mới
        InviteLinkResponse inviteLinkResponse = inviteService.generateInviteLink(savedUser.getRole(), null, null, userId); // Gửi userId vào generateInviteLink


        inviteTokenRepository.save(inviteToken);
        AuthenticationService.TokenInfo tokenInfo = generateToken(savedUser);

        return ResponseEntity.ok(Map.of(
                "userId", savedUser.getId(),
                "token", tokenInfo.token(),
                "accessToken", accessToken,
                "expiryTime", tokenInfo.expiryDate(),
                "email", email,
                "name", name,
                "picture", picture
        ));
    }

    private String getAccessTokenFromGoogle(String code) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        String tokenUrl = "https://oauth2.googleapis.com/token";

        Map<String, String> params = new HashMap<>();
        params.put("code", code);
        params.put("client_id", GOOGLE_CLIENT_ID);
        params.put("client_secret", GOOGLE_CLIENT_SECRET);
        params.put("redirect_uri", "http://localhost:5173/oauth2/redirect");
        params.put("grant_type", "authorization_code");

        ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, params, Map.class);

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new Exception("Failed to fetch access token");
        }

        return (String) response.getBody().get("access_token");
    }

    private String getAccessTokenFromFacebook(String code) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        String tokenUrl = "https://graph.facebook.com/v12.0/oauth/access_token"
                + "?client_id=" + FACEBOOK_CLIENT_ID
                + "&client_secret=" + FACEBOOK_CLIENT_SECRET
                + "&redirect_uri=http://localhost:5173/oauth2/callback/facebook"
                + "&code=" + code;

        ResponseEntity<Map> response = restTemplate.getForEntity(tokenUrl, Map.class);

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new Exception("Failed to fetch access token");
        }

        return (String) response.getBody().get("access_token");
    }

    private Map<String, Object> getUserInfoFromGoogle(String accessToken) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        String userInfoUrl = "https://www.googleapis.com/oauth2/v3/userinfo";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<?> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(userInfoUrl, HttpMethod.GET, entity, Map.class);

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new Exception("Failed to fetch user info");
        }

        return response.getBody();
    }

    private Map<String, Object> getUserInfoFromFacebook(String accessToken) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        String userInfoUrl = "https://graph.facebook.com/me?fields=id,name,email,picture";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<?> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(userInfoUrl, HttpMethod.GET, entity, Map.class);

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new Exception("Failed to fetch user info");
        }

        return response.getBody();
    }


}

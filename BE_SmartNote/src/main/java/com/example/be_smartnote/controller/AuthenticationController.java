package com.example.be_smartnote.controller;

import com.example.be_smartnote.dto.request.AuthenticationRequest;
import com.example.be_smartnote.dto.request.ApiResponse;
import com.example.be_smartnote.dto.response.AuthenticationResponse;
import com.example.be_smartnote.entities.User;
import com.example.be_smartnote.repository.UserRepository;
import com.example.be_smartnote.service.AuthenticationService;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
@Slf4j
@RestController()
@RequestMapping("/api/auth")
public class AuthenticationController {
    @Autowired
    private AuthenticationService authenticationService;

    @NonFinal
    @Value("${spring.security.oauth2.client.registration.facebook.client-id}")
    protected String FACEBOOK_CLIENT_ID;

    @NonFinal
    @Value("${spring.security.oauth2.client.registration.facebook.client-secret}")
    protected String FACEBOOK_CLIENT_SECRET;

    @NonFinal
    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    protected String GOOGLE_CLIENT_ID;

    @NonFinal
    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    protected String GOOGLE_CLIENT_SECRET;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        var result = authenticationService.authenticate(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .code(1000)
                .message("success")
                .result(result)
                .build();
    }

    @PostMapping("/oauth2/callback/google")
    public ResponseEntity<?> handleGoogleCallback(@RequestBody Map<String, String> body) {
        String code = body.get("code");
        if (code == null) {
            return ResponseEntity.badRequest().body("No code provided");
        }

        try {
            // 1. Lấy access token từ Google
            String accessToken = getAccessTokenFromCode(code);
            log.info("access token : {}", accessToken);
            // 2. Lấy thông tin người dùng từ Google
            Map<String, Object> userInfo = getUserInfoFromGoogle(accessToken);

            // 3. Lấy thông tin người dùng từ email
            String email = (String) userInfo.get("email");
            String name = (String) userInfo.get("name");
            String picture = (String) userInfo.get("picture");


            // Kiểm tra xem người dùng đã tồn tại trong database chưa
            Optional<User> existingUser = userRepository.findByEmail(email);

            System.out.println(existingUser);

            if (existingUser.isPresent()) {
                // Nếu đã tồn tại, tạo token và trả về thông tin
                AuthenticationService.TokenInfo tokenInfo = authenticationService.generateToken(existingUser.get());
                return ResponseEntity.ok(Map.of(
                        "userId", existingUser.get().getId(),
                        "token", tokenInfo.token(),
                        "expiryTime", tokenInfo.expiryDate(),
                        "email", email,
                        "name", existingUser.get().getFullName(),
                        "picture", picture,
                        "accessToken", accessToken

                ));
            }

            // 4. Nếu không tồn tại, tạo người dùng mới

            User newUser = new User();
            newUser.setFullName(name);
            newUser.setPassword("password account google");
            newUser.setEmail(email);
            newUser.setProvider("google");
            newUser.setAvatarUrl(picture);
            User savedUser = userRepository.save(newUser);


            // 5. Tạo token cho người dùng mới
            AuthenticationService.TokenInfo tokenInfo = authenticationService.generateToken(savedUser);

            // 6. Trả về token và thông tin người dùng
            return ResponseEntity.ok(Map.of(
                    "userId", newUser.getId(),
                    "token", tokenInfo.token(),
                    "accessToken", accessToken,
                    "expiryTime", tokenInfo.expiryDate(),
                    "email", email,
                    "name", name,
                    "picture", picture
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error during Google login: " + e.getMessage());
        }
    }


    private String getAccessTokenFromCode(String code) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        String tokenUrl = "https://oauth2.googleapis.com/token";

        Map<String, String> params =    new HashMap<>();
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

    //login facebook
    @PostMapping("/oauth2/callback/facebook")
    public ResponseEntity<?> handleFacebookCallback(@RequestBody Map<String, String> body) {
        String code = body.get("code");
        if (code == null) {
            return ResponseEntity.badRequest().body("No code provided");
        }

        try {
            // 1. Lấy access token từ Facebook
            String accessToken = getAccessTokenFromCodeWithFacebook(code);

            // 2. Lấy thông tin người dùng từ Facebook
            Map<String, Object> userInfo = getUserInfoFromFacebook(accessToken);

            // 3. Lấy thông tin người dùng từ email
                        String email = (String) userInfo.get("email");
            String name = (String) userInfo.get("name");
            String picture = (String) userInfo.get("picture");
            // Kiểm tra xem người dùng đã tồn tại trong database chưa
            Optional<User> existingUser = userRepository.findByEmail(email);
            System.out.println(existingUser);
            if (existingUser.isPresent()) {
                // Nếu đã tồn tại, tạo token và trả về thông tin
                AuthenticationService.TokenInfo tokenInfo = authenticationService.generateToken(existingUser.get());
                return ResponseEntity.ok(Map.of(
                        "token", tokenInfo.token(),
                        "email", email,
                        "name", existingUser.get().getFullName(),
                        "picture", picture,
                        "accessToken", accessToken
                ));
            }

            // 4. Nếu không tồn tại, tạo người dùng mới
            User newUser = new User();
            newUser.setFullName(name);
            newUser.setEmail(email);
            newUser.setPassword("oauth2_default_password_facebook"); // Mật khẩu mặc định
            newUser.setProvider("facebook"); // Vai trò mặc
            newUser.setAvatarUrl(picture);
            userRepository.save(newUser);


            // 5. Tạo token JWT cho người dùng mới
            AuthenticationService.TokenInfo tokenInfo = authenticationService.generateToken(newUser);

            // 6. Trả về token và thông tin người dùng
            return ResponseEntity.ok(Map.of(
                    "token", tokenInfo.token(),
                    "accessToken", accessToken,
                    "email", email,
                    "name", name,
                    "picture", picture
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error during Facebook login: " + e.getMessage());
        }
    }


    private String getAccessTokenFromCodeWithFacebook(String code) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        String tokenUrl = "https://graph.facebook.com/v12.0/oauth/access_token"
                + "?client_id=" + FACEBOOK_CLIENT_ID
                + "&client_secret=" + FACEBOOK_CLIENT_SECRET
                + "&redirect_uri=http://localhost:3000/oauth2/callback/facebook"
                + "&code=" + code;

        ResponseEntity<Map> response = restTemplate.getForEntity(tokenUrl, Map.class);

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new Exception("Failed to fetch access token");
        }

        return (String) response.getBody().get("access_token");
    }


    private Map<String, Object> getUserInfoFromFacebook(String accessToken) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        String userInfoUrl = "https://graph.facebook.com/me?fields=id,name,email,picture";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<?> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(userInfoUrl, HttpMethod.GET, entity,
                Map.class);

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new Exception("Failed to fetch user info");
        }

        return response.getBody();
    }


    private Map<String, Object> getUserInfoFromGoogle(String accessToken) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        String userInfoUrl = "https://www.googleapis.com/oauth2/v3/userinfo";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<?> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(userInfoUrl, HttpMethod.GET, entity,
                Map.class);

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new Exception("Failed to fetch user info");
        }

        return response.getBody();
    }


}

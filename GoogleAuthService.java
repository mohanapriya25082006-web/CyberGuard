
package com.cyberguard.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class GoogleAuthService {

    private final GoogleIdTokenVerifier verifier;

    public GoogleAuthService(
            @Value("${google.client-id}") String clientId) {

        this.verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(),
                GsonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList(clientId))
                .build();
    }

    public GoogleUser verifyCredential(String credential) {
        try {
            GoogleIdToken idToken = verifier.verify(credential);

            if (idToken == null) {
                throw new IllegalArgumentException(
                        "Invalid Google credential");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();

            if (!Boolean.TRUE.equals(payload.getEmailVerified())) {
                throw new IllegalArgumentException(
                        "Google email is not verified");
            }

            String email = payload.getEmail();
            String name = (String) payload.get("name");

            if (email == null || email.isBlank()) {
                throw new IllegalArgumentException(
                        "Google account has no email");
            }

            return new GoogleUser(
                    email,
                    name == null || name.isBlank() ? email : name);

        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new IllegalArgumentException(
                    "Could not verify Google sign-in");
        }
    }

    public record GoogleUser(String email, String fullName) {}
}

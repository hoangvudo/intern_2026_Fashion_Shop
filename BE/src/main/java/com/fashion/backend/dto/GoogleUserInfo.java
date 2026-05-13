package com.fashion.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/**
 * Map response từ Google UserInfo endpoint:
 * GET https://www.googleapis.com/oauth2/v3/userinfo
 */
@Data
public class GoogleUserInfo {

    private String sub;           // Google user ID

    private String email;

    @JsonProperty("email_verified")
    private boolean emailVerified;

    private String name;

    @JsonProperty("given_name")
    private String givenName;

    @JsonProperty("family_name")
    private String familyName;

    private String picture;
}
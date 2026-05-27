package com.fashion.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.Map;

/**
 * Map response từ Facebook Graph API:
 * GET https://graph.facebook.com/me?fields=id,name,email,picture
 */
@Data
public class FacebookUserInfo {

    private String id;           // Facebook user ID

    private String email;

    private String name;

    @JsonProperty("picture")
    private Map<String, Object> picture;  // { "data": { "url": "..." } }

    // Helper method để lấy URL ảnh đại diện
    public String getPictureUrl() {
        if (picture != null && picture.containsKey("data")) {
            Object data = picture.get("data");
            if (data instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> dataMap = (Map<String, Object>) data;
                return (String) dataMap.get("url");
            }
        }
        return null;
    }
}

package com.fashion.backend.dto;

import lombok.Data;

@Data
public class ContactUpdateRequest {
    private String status;     // UNREAD | READ | REPLIED | ARCHIVED
    private String adminNote;
}
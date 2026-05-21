package com.fashion.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CheckEmailResponse {

    private boolean exists;
}
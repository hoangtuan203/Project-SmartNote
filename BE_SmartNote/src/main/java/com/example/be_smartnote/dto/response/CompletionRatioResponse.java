package com.example.be_smartnote.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CompletionRatioResponse {
    private String status;
    private Long count;
}

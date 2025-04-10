package com.example.be_smartnote.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OverdueTaskResponse {
    private String date;
    private Long count;
}
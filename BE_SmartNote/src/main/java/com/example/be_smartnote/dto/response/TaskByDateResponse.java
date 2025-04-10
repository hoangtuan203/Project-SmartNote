package com.example.be_smartnote.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TaskByDateResponse {
    private String day;
    private Long completed;

}

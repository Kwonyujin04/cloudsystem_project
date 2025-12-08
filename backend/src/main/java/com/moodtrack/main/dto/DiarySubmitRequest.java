package com.moodtrack.main.dto;

import lombok.Getter;

import java.time.LocalDate;

@Getter
public class DiarySubmitRequest {
    private String content;
    private LocalDate selectedDate;
}

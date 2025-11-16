package com.moodtrack.main.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class DiarySubmitResponse {
    private Long diaryId;
    private String label;
    private Double score;
    private Integer intensity;
    private String summary;
}

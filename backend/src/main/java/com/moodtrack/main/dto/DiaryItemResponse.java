package com.moodtrack.main.dto;

import com.moodtrack.main.entity.Diary;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiaryItemResponse {
    private Long id;
    private String content;
    private String label;
    private Double score;
    private Integer intensity;
    private String summary;
    private LocalDateTime createdAt;
}

package com.moodtrack.main.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class DiarySubmitResponse {
    private Long diaryId;
    private String label;
    private Double score;
    private Integer intensity;
    private String summary;
    private List<String> keywords;
    private List<String>  musicTitles;
    private List<String>  musicArtists;
    private List<String>  musicCovers;
    private List<String>  musicUrls;
}

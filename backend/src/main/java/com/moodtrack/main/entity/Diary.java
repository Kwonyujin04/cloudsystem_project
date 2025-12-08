package com.moodtrack.main.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "diary")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class Diary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, columnDefinition = "text")
    private String content;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    // --- AI 분석 결과 ---
    @Column(name = "label")
    private String label;

    @Column(name = "score")
    private Double score;

    @Column(name = "intensity")
    private Integer intensity;

    @Column(name = "summary", columnDefinition = "text")
    private String summary;

    @ElementCollection
    @CollectionTable(name = "diary_keywords", joinColumns = @JoinColumn(name = "diary_id"))
    @Column(name = "keyword")
    private List<String> keywords;

    @Setter
    @OneToMany(mappedBy = "diary", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Music> musicList;


    @PrePersist
    private void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}

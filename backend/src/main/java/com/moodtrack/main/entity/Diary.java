package com.moodtrack.main.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

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

    // 어떤 유저가 쓴 일기인지
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

    // 연관관계 편의 메서드
    public void setUser(User user) {
        this.user = user;
    }

    @PrePersist
    private void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}

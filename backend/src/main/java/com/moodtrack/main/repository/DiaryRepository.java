package com.moodtrack.main.repository;

import com.moodtrack.main.entity.Diary;
import com.moodtrack.main.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface DiaryRepository extends JpaRepository<Diary, Long> {
    @Query("SELECT d FROM Diary d WHERE d.user = :user AND d.createdAt BETWEEN :start AND :end")
    List<Diary> findDiariesBetween(User user, LocalDateTime start, LocalDateTime end);

    @Query("SELECT d FROM Diary d JOIN FETCH d.musicList WHERE d.user = :user ORDER BY d.createdAt DESC")
    Page<Diary> findByUserOrderByCreatedAtDescWithMusic(User user, Pageable pageable);
}


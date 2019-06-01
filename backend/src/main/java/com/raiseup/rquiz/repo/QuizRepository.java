package com.raiseup.rquiz.repo;

import com.raiseup.rquiz.models.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    @Query("SELECT q FROM Quiz AS q WHERE q.isPublic = :isPublic")
    List<Quiz> findAllByPublic (@Param("isPublic") Boolean isPublic, Pageable pageable);

    @Query("SELECT q FROM Quiz AS q WHERE q.isPublic = :isPublic")
    List<Quiz> findAllByPublic (@Param("isPublic") Boolean isPublic);
}

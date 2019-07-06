package com.raiseup.rquiz.repo;

import com.raiseup.rquiz.models.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface QuizRepository extends JpaRepository<Quiz, String> {
    @Query("SELECT q FROM Quiz AS q WHERE q.isPublic = :isPublic")
    List<Quiz> findAllByPublic (@Param("isPublic") Boolean isPublic, Pageable pageable);

    @Query("SELECT q FROM Quiz AS q WHERE q.isPublic = :isPublic")
    List<Quiz> findAllByPublic (@Param("isPublic") Boolean isPublic);

    @Query("SELECT q FROM Quiz AS q WHERE q.creatorId = :creatorId")
    List<Quiz> findAllByCreator(@Param("creatorId") String creatorId, Pageable pageable);

//    @Query("SELECT q FROM Quiz AS q left join QuizAnswer a ON q.id=a.id WHERE q.id = :id")
//    Quiz findWithAnswers(@Param("id") String id);
}

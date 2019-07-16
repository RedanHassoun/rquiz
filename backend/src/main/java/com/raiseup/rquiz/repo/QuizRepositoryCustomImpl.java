package com.raiseup.rquiz.repo;


import com.raiseup.rquiz.models.Quiz;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

@Repository
public class QuizRepositoryCustomImpl implements QuizRepositoryCustom {
    private Logger logger = LoggerFactory.getLogger(QuizRepositoryCustomImpl.class);

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Quiz> findQuizListByParameters(HashMap<String, Object> params) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Quiz> query = cb.createQuery(Quiz.class);
        Root<Quiz> user = query.from(Quiz.class);

        List<Predicate> predicates = new ArrayList<>();

        Iterator itr = params.keySet().iterator();
        while (itr.hasNext()) {
            String currFieldName = (String) itr.next();
            Path<String> fieldPath = user.get(currFieldName);
            if(fieldPath == null){
                final String errMsg = String.format("Field %s doesn't exist in the quiz object",
                                                    currFieldName);
                this.logger.error(errMsg);
                throw new IllegalArgumentException(errMsg);
            }

            predicates.add(cb.equal(fieldPath, params.get(currFieldName)));
        }

        query.select(user)
                .where(cb.and(predicates.toArray(new Predicate[predicates.size()])));

        return entityManager.createQuery(query).getResultList();
    }

}

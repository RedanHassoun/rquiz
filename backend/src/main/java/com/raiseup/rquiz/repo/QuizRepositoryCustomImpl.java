package com.raiseup.rquiz.repo;


import com.raiseup.rquiz.models.Quiz;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
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
    public List<Quiz> findQuizListByParameters(HashMap<String, Object> params,
                                               Pageable pageable) {
        this.logger.debug(String.format("Getting quiz list by parameters"));

        CriteriaBuilder cb = this.entityManager.getCriteriaBuilder();

        CriteriaQuery<Quiz> query = cb.createQuery(Quiz.class);
        Root<Quiz> from = query.from(Quiz.class);

        // Add the parameters for the 'where' condition
        List<Predicate> predicates = new ArrayList<>();

        Iterator itr = params.keySet().iterator();
        while (itr.hasNext()) {
            String currFieldName = (String) itr.next();
            Path<String> fieldPath = from.get(currFieldName);
            if(fieldPath == null){
                final String errMsg = String.format("Field %s doesn't exist in the quiz object",
                                                    currFieldName);
                this.logger.error(errMsg);
                throw new IllegalArgumentException(errMsg);
            }

            predicates.add(cb.equal(fieldPath, params.get(currFieldName)));
        }

        CriteriaQuery<Quiz> select = query.select(from)
                .where(cb.and(predicates.toArray(new Predicate[predicates.size()])));

        TypedQuery<Quiz> typedQuery = this.entityManager.createQuery(select);

        if(pageable != null){
             int pageNumber = pageable.getPageNumber();
             int pageSize = pageable.getPageSize();

             this.logger.debug(String.format("Using paging. page: %s, size: %s",
                                             pageNumber, pageSize));
            typedQuery.setFirstResult(pageNumber);
            typedQuery.setMaxResults(pageSize);
        }

        List<Quiz> quizList = typedQuery.getResultList();
        this.logger.debug(String.format("Returning %d quizzes", quizList.size()));
        return quizList;
    }

}

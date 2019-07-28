package com.raiseup.rquiz.repo;


import com.raiseup.rquiz.models.Quiz;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

        select = this.HandleSortingParameters(cb, select, from, pageable);

        TypedQuery<Quiz> typedQuery = this.entityManager.createQuery(select);

        if(pageable != null){
             int pageNumber = pageable.getPageNumber();
             int pageSize = pageable.getPageSize();

             this.logger.debug(String.format("Using paging. page: %s, size: %s",
                                             pageNumber, pageSize));
            typedQuery.setFirstResult(pageNumber * pageSize);
            typedQuery.setMaxResults(pageSize);
        }

        List<Quiz> quizList = typedQuery.getResultList();
        this.logger.debug(String.format("Returning %d quizzes", quizList.size()));
        return quizList;
    }

    /**
     * This method defines the sorting mechanism for the query according
     * to the parameters that were sent inside the 'pageable'.
     * It supports only one parameter for sorting
     * @param cb
     * @param select
     * @param from
     * @param pageable
     */
    private CriteriaQuery<Quiz> HandleSortingParameters(CriteriaBuilder cb,
                                         CriteriaQuery<Quiz> select,
                                         Root<Quiz> from,
                                         Pageable pageable){
        if(pageable == null){
            return select;
        }

        String property = null;
        Sort.Direction sortingDirection = null;
        Iterator<Sort.Order> itr = pageable.getSort().iterator();
        while (itr.hasNext()){
            Sort.Order param = itr.next();
            property = param.getProperty();
            sortingDirection = param.getDirection();
        }

        if(property == null || sortingDirection == null){
            this.logger.debug(String.format("Query %s dosen't contain a sorting parameters",
                                select.toString()));
            return select;
        }

        if(sortingDirection.isDescending()){
            select.orderBy(cb.desc(from.get(property)));
        }else {
            select.orderBy(cb.asc(from.get(property)));
        }

        return select;
    }
}

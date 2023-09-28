package me.krft.frontend.repository;

import me.krft.frontend.domain.Rating;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC repository for the Rating entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RatingRepository extends ReactiveCrudRepository<Rating, Long>, RatingRepositoryInternal {
    @Query("SELECT * FROM rating entity WHERE entity.application_user_offer_id = :id")
    Flux<Rating> findByApplicationUserOffer(Long id);

    @Query("SELECT * FROM rating entity WHERE entity.application_user_offer_id IS NULL")
    Flux<Rating> findAllWhereApplicationUserOfferIsNull();

    @Override
    <S extends Rating> Mono<S> save(S entity);

    @Override
    Flux<Rating> findAll();

    @Override
    Mono<Rating> findById(Long id);

    @Override
    Mono<Void> deleteById(Long id);
}

interface RatingRepositoryInternal {
    <S extends Rating> Mono<S> save(S entity);

    Flux<Rating> findAllBy(Pageable pageable);

    Flux<Rating> findAll();

    Mono<Rating> findById(Long id);
    // this is not supported at the moment because of https://github.com/jhipster/generator-jhipster/issues/18269
    // Flux<Rating> findAllBy(Pageable pageable, Criteria criteria);

}

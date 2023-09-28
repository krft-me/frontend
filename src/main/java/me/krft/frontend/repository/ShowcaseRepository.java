package me.krft.frontend.repository;

import me.krft.frontend.domain.Showcase;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC repository for the Showcase entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ShowcaseRepository extends ReactiveCrudRepository<Showcase, Long>, ShowcaseRepositoryInternal {
    @Query("SELECT * FROM showcase entity WHERE entity.application_user_offer_id = :id")
    Flux<Showcase> findByApplicationUserOffer(Long id);

    @Query("SELECT * FROM showcase entity WHERE entity.application_user_offer_id IS NULL")
    Flux<Showcase> findAllWhereApplicationUserOfferIsNull();

    @Override
    <S extends Showcase> Mono<S> save(S entity);

    @Override
    Flux<Showcase> findAll();

    @Override
    Mono<Showcase> findById(Long id);

    @Override
    Mono<Void> deleteById(Long id);
}

interface ShowcaseRepositoryInternal {
    <S extends Showcase> Mono<S> save(S entity);

    Flux<Showcase> findAllBy(Pageable pageable);

    Flux<Showcase> findAll();

    Mono<Showcase> findById(Long id);
    // this is not supported at the moment because of https://github.com/jhipster/generator-jhipster/issues/18269
    // Flux<Showcase> findAllBy(Pageable pageable, Criteria criteria);

}

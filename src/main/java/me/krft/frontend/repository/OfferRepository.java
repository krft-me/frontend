package me.krft.frontend.repository;

import me.krft.frontend.domain.Offer;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC repository for the Offer entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OfferRepository extends ReactiveCrudRepository<Offer, Long>, OfferRepositoryInternal {
    @Query("SELECT * FROM offer entity WHERE entity.machine_id = :id")
    Flux<Offer> findByMachine(Long id);

    @Query("SELECT * FROM offer entity WHERE entity.machine_id IS NULL")
    Flux<Offer> findAllWhereMachineIsNull();

    @Override
    <S extends Offer> Mono<S> save(S entity);

    @Override
    Flux<Offer> findAll();

    @Override
    Mono<Offer> findById(Long id);

    @Override
    Mono<Void> deleteById(Long id);
}

interface OfferRepositoryInternal {
    <S extends Offer> Mono<S> save(S entity);

    Flux<Offer> findAllBy(Pageable pageable);

    Flux<Offer> findAll();

    Mono<Offer> findById(Long id);
    // this is not supported at the moment because of https://github.com/jhipster/generator-jhipster/issues/18269
    // Flux<Offer> findAllBy(Pageable pageable, Criteria criteria);

}

package me.krft.frontend.repository;

import me.krft.frontend.domain.Machine;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC repository for the Machine entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MachineRepository extends ReactiveCrudRepository<Machine, Long>, MachineRepositoryInternal {
    @Query("SELECT * FROM machine entity WHERE entity.offer_id = :id")
    Flux<Machine> findByOffer(Long id);

    @Query("SELECT * FROM machine entity WHERE entity.offer_id IS NULL")
    Flux<Machine> findAllWhereOfferIsNull();

    @Override
    <S extends Machine> Mono<S> save(S entity);

    @Override
    Flux<Machine> findAll();

    @Override
    Mono<Machine> findById(Long id);

    @Override
    Mono<Void> deleteById(Long id);
}

interface MachineRepositoryInternal {
    <S extends Machine> Mono<S> save(S entity);

    Flux<Machine> findAllBy(Pageable pageable);

    Flux<Machine> findAll();

    Mono<Machine> findById(Long id);
    // this is not supported at the moment because of https://github.com/jhipster/generator-jhipster/issues/18269
    // Flux<Machine> findAllBy(Pageable pageable, Criteria criteria);

}

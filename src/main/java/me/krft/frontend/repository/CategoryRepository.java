package me.krft.frontend.repository;

import me.krft.frontend.domain.Category;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC repository for the Category entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CategoryRepository extends ReactiveCrudRepository<Category, Long>, CategoryRepositoryInternal {
    @Query("SELECT * FROM category entity WHERE entity.machine_id = :id")
    Flux<Category> findByMachine(Long id);

    @Query("SELECT * FROM category entity WHERE entity.machine_id IS NULL")
    Flux<Category> findAllWhereMachineIsNull();

    @Override
    <S extends Category> Mono<S> save(S entity);

    @Override
    Flux<Category> findAll();

    @Override
    Mono<Category> findById(Long id);

    @Override
    Mono<Void> deleteById(Long id);
}

interface CategoryRepositoryInternal {
    <S extends Category> Mono<S> save(S entity);

    Flux<Category> findAllBy(Pageable pageable);

    Flux<Category> findAll();

    Mono<Category> findById(Long id);
    // this is not supported at the moment because of https://github.com/jhipster/generator-jhipster/issues/18269
    // Flux<Category> findAllBy(Pageable pageable, Criteria criteria);

}

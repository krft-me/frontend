package me.krft.frontend.repository;

import me.krft.frontend.domain.City;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC repository for the City entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CityRepository extends ReactiveCrudRepository<City, Long>, CityRepositoryInternal {
    @Query("SELECT * FROM city entity WHERE entity.region_id = :id")
    Flux<City> findByRegion(Long id);

    @Query("SELECT * FROM city entity WHERE entity.region_id IS NULL")
    Flux<City> findAllWhereRegionIsNull();

    @Override
    <S extends City> Mono<S> save(S entity);

    @Override
    Flux<City> findAll();

    @Override
    Mono<City> findById(Long id);

    @Override
    Mono<Void> deleteById(Long id);
}

interface CityRepositoryInternal {
    <S extends City> Mono<S> save(S entity);

    Flux<City> findAllBy(Pageable pageable);

    Flux<City> findAll();

    Mono<City> findById(Long id);
    // this is not supported at the moment because of https://github.com/jhipster/generator-jhipster/issues/18269
    // Flux<City> findAllBy(Pageable pageable, Criteria criteria);

}

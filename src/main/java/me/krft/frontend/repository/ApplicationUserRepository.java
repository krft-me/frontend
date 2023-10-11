package me.krft.frontend.repository;

import me.krft.frontend.domain.ApplicationUser;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC repository for the ApplicationUser entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ApplicationUserRepository extends ReactiveCrudRepository<ApplicationUser, Long>, ApplicationUserRepositoryInternal {
    @Override
    Mono<ApplicationUser> findOneWithEagerRelationships(Long id);

    @Override
    Flux<ApplicationUser> findAllWithEagerRelationships();

    @Override
    Flux<ApplicationUser> findAllWithEagerRelationships(Pageable page);

    @Query("SELECT * FROM application_user entity WHERE entity.internal_user_id = :id")
    Flux<ApplicationUser> findByInternalUser(Long id);

    @Query("SELECT * FROM application_user entity WHERE entity.internal_user_id IS NULL")
    Flux<ApplicationUser> findAllWhereInternalUserIsNull();

    @Query("SELECT * FROM application_user entity WHERE entity.city_id = :id")
    Flux<ApplicationUser> findByCity(Long id);

    @Query("SELECT * FROM application_user entity WHERE entity.city_id IS NULL")
    Flux<ApplicationUser> findAllWhereCityIsNull();

    @Query(
        "SELECT entity.* FROM application_user entity JOIN rel_application_user__favorite_application_user joinTable ON entity.id = joinTable.favorite_application_user_id WHERE joinTable.favorite_application_user_id = :id"
    )
    Flux<ApplicationUser> findByFavoriteApplicationUser(Long id);

    @Query(
        "SELECT entity.* FROM application_user entity JOIN rel_application_user__favorite_offer joinTable ON entity.id = joinTable.favorite_offer_id WHERE joinTable.favorite_offer_id = :id"
    )
    Flux<ApplicationUser> findByFavoriteOffer(Long id);

    @Override
    <S extends ApplicationUser> Mono<S> save(S entity);

    @Override
    Flux<ApplicationUser> findAll();

    @Override
    Mono<ApplicationUser> findById(Long id);

    @Override
    Mono<Void> deleteById(Long id);
}

interface ApplicationUserRepositoryInternal {
    <S extends ApplicationUser> Mono<S> save(S entity);

    Flux<ApplicationUser> findAllBy(Pageable pageable);

    Flux<ApplicationUser> findAll();

    Mono<ApplicationUser> findById(Long id);
    // this is not supported at the moment because of https://github.com/jhipster/generator-jhipster/issues/18269
    // Flux<ApplicationUser> findAllBy(Pageable pageable, Criteria criteria);

    Mono<ApplicationUser> findOneWithEagerRelationships(Long id);

    Flux<ApplicationUser> findAllWithEagerRelationships();

    Flux<ApplicationUser> findAllWithEagerRelationships(Pageable page);

    Mono<Void> deleteById(Long id);
}

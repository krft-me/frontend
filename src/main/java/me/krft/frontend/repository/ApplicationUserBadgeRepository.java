package me.krft.frontend.repository;

import me.krft.frontend.domain.ApplicationUserBadge;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC repository for the ApplicationUserBadge entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ApplicationUserBadgeRepository
    extends ReactiveCrudRepository<ApplicationUserBadge, Long>, ApplicationUserBadgeRepositoryInternal {
    @Query("SELECT * FROM application_user_badge entity WHERE entity.application_user_id = :id")
    Flux<ApplicationUserBadge> findByApplicationUser(Long id);

    @Query("SELECT * FROM application_user_badge entity WHERE entity.application_user_id IS NULL")
    Flux<ApplicationUserBadge> findAllWhereApplicationUserIsNull();

    @Query("SELECT * FROM application_user_badge entity WHERE entity.badge_id = :id")
    Flux<ApplicationUserBadge> findByBadge(Long id);

    @Query("SELECT * FROM application_user_badge entity WHERE entity.badge_id IS NULL")
    Flux<ApplicationUserBadge> findAllWhereBadgeIsNull();

    @Override
    <S extends ApplicationUserBadge> Mono<S> save(S entity);

    @Override
    Flux<ApplicationUserBadge> findAll();

    @Override
    Mono<ApplicationUserBadge> findById(Long id);

    @Override
    Mono<Void> deleteById(Long id);
}

interface ApplicationUserBadgeRepositoryInternal {
    <S extends ApplicationUserBadge> Mono<S> save(S entity);

    Flux<ApplicationUserBadge> findAllBy(Pageable pageable);

    Flux<ApplicationUserBadge> findAll();

    Mono<ApplicationUserBadge> findById(Long id);
    // this is not supported at the moment because of https://github.com/jhipster/generator-jhipster/issues/18269
    // Flux<ApplicationUserBadge> findAllBy(Pageable pageable, Criteria criteria);

}

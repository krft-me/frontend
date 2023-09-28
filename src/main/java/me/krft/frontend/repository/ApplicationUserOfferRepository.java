package me.krft.frontend.repository;

import me.krft.frontend.domain.ApplicationUserOffer;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC repository for the ApplicationUserOffer entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ApplicationUserOfferRepository
    extends ReactiveCrudRepository<ApplicationUserOffer, Long>, ApplicationUserOfferRepositoryInternal {
    @Query("SELECT * FROM application_user_offer entity WHERE entity.offer_id = :id")
    Flux<ApplicationUserOffer> findByOffer(Long id);

    @Query("SELECT * FROM application_user_offer entity WHERE entity.offer_id IS NULL")
    Flux<ApplicationUserOffer> findAllWhereOfferIsNull();

    @Query("SELECT * FROM application_user_offer entity WHERE entity.application_user_id = :id")
    Flux<ApplicationUserOffer> findByApplicationUser(Long id);

    @Query("SELECT * FROM application_user_offer entity WHERE entity.application_user_id IS NULL")
    Flux<ApplicationUserOffer> findAllWhereApplicationUserIsNull();

    @Override
    <S extends ApplicationUserOffer> Mono<S> save(S entity);

    @Override
    Flux<ApplicationUserOffer> findAll();

    @Override
    Mono<ApplicationUserOffer> findById(Long id);

    @Override
    Mono<Void> deleteById(Long id);
}

interface ApplicationUserOfferRepositoryInternal {
    <S extends ApplicationUserOffer> Mono<S> save(S entity);

    Flux<ApplicationUserOffer> findAllBy(Pageable pageable);

    Flux<ApplicationUserOffer> findAll();

    Mono<ApplicationUserOffer> findById(Long id);
    // this is not supported at the moment because of https://github.com/jhipster/generator-jhipster/issues/18269
    // Flux<ApplicationUserOffer> findAllBy(Pageable pageable, Criteria criteria);

}

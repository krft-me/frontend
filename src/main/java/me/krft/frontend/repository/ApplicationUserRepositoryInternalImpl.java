package me.krft.frontend.repository;

import static org.springframework.data.relational.core.query.Criteria.where;
import static org.springframework.data.relational.core.query.Query.query;

import io.r2dbc.spi.Row;
import io.r2dbc.spi.RowMetadata;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.function.BiFunction;
import me.krft.frontend.domain.ApplicationUser;
import me.krft.frontend.domain.ApplicationUser;
import me.krft.frontend.domain.Offer;
import me.krft.frontend.repository.rowmapper.ApplicationUserRowMapper;
import me.krft.frontend.repository.rowmapper.CityRowMapper;
import me.krft.frontend.repository.rowmapper.UserRowMapper;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.convert.R2dbcConverter;
import org.springframework.data.r2dbc.core.R2dbcEntityOperations;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.data.r2dbc.repository.support.SimpleR2dbcRepository;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.data.relational.core.sql.Column;
import org.springframework.data.relational.core.sql.Comparison;
import org.springframework.data.relational.core.sql.Condition;
import org.springframework.data.relational.core.sql.Conditions;
import org.springframework.data.relational.core.sql.Expression;
import org.springframework.data.relational.core.sql.Select;
import org.springframework.data.relational.core.sql.SelectBuilder.SelectFromAndJoinCondition;
import org.springframework.data.relational.core.sql.Table;
import org.springframework.data.relational.repository.support.MappingRelationalEntityInformation;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.r2dbc.core.RowsFetchSpec;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC custom repository implementation for the ApplicationUser entity.
 */
@SuppressWarnings("unused")
class ApplicationUserRepositoryInternalImpl
    extends SimpleR2dbcRepository<ApplicationUser, Long>
    implements ApplicationUserRepositoryInternal {

    private final DatabaseClient db;
    private final R2dbcEntityTemplate r2dbcEntityTemplate;
    private final EntityManager entityManager;

    private final UserRowMapper userMapper;
    private final CityRowMapper cityMapper;
    private final ApplicationUserRowMapper applicationuserMapper;

    private static final Table entityTable = Table.aliased("application_user", EntityManager.ENTITY_ALIAS);
    private static final Table internalUserTable = Table.aliased("jhi_user", "internalUser");
    private static final Table cityTable = Table.aliased("city", "city");

    private static final EntityManager.LinkTable favoriteApplicationUserLink = new EntityManager.LinkTable(
        "rel_application_user__favorite_application_user",
        "application_user_id",
        "favorite_application_user_id"
    );
    private static final EntityManager.LinkTable favoriteOfferLink = new EntityManager.LinkTable(
        "rel_application_user__favorite_offer",
        "application_user_id",
        "favorite_offer_id"
    );

    public ApplicationUserRepositoryInternalImpl(
        R2dbcEntityTemplate template,
        EntityManager entityManager,
        UserRowMapper userMapper,
        CityRowMapper cityMapper,
        ApplicationUserRowMapper applicationuserMapper,
        R2dbcEntityOperations entityOperations,
        R2dbcConverter converter
    ) {
        super(
            new MappingRelationalEntityInformation(converter.getMappingContext().getRequiredPersistentEntity(ApplicationUser.class)),
            entityOperations,
            converter
        );
        this.db = template.getDatabaseClient();
        this.r2dbcEntityTemplate = template;
        this.entityManager = entityManager;
        this.userMapper = userMapper;
        this.cityMapper = cityMapper;
        this.applicationuserMapper = applicationuserMapper;
    }

    @Override
    public Flux<ApplicationUser> findAllBy(Pageable pageable) {
        return createQuery(pageable, null).all();
    }

    RowsFetchSpec<ApplicationUser> createQuery(Pageable pageable, Condition whereClause) {
        List<Expression> columns = ApplicationUserSqlHelper.getColumns(entityTable, EntityManager.ENTITY_ALIAS);
        columns.addAll(UserSqlHelper.getColumns(internalUserTable, "internalUser"));
        columns.addAll(CitySqlHelper.getColumns(cityTable, "city"));
        SelectFromAndJoinCondition selectFrom = Select
            .builder()
            .select(columns)
            .from(entityTable)
            .leftOuterJoin(internalUserTable)
            .on(Column.create("internal_user_id", entityTable))
            .equals(Column.create("id", internalUserTable))
            .leftOuterJoin(cityTable)
            .on(Column.create("city_id", entityTable))
            .equals(Column.create("id", cityTable));
        // we do not support Criteria here for now as of https://github.com/jhipster/generator-jhipster/issues/18269
        String select = entityManager.createSelect(selectFrom, ApplicationUser.class, pageable, whereClause);
        return db.sql(select).map(this::process);
    }

    @Override
    public Flux<ApplicationUser> findAll() {
        return findAllBy(null);
    }

    @Override
    public Mono<ApplicationUser> findById(Long id) {
        Comparison whereClause = Conditions.isEqual(entityTable.column("id"), Conditions.just(id.toString()));
        return createQuery(null, whereClause).one();
    }

    @Override
    public Mono<ApplicationUser> findOneWithEagerRelationships(Long id) {
        return findById(id);
    }

    @Override
    public Flux<ApplicationUser> findAllWithEagerRelationships() {
        return findAll();
    }

    @Override
    public Flux<ApplicationUser> findAllWithEagerRelationships(Pageable page) {
        return findAllBy(page);
    }

    private ApplicationUser process(Row row, RowMetadata metadata) {
        ApplicationUser entity = applicationuserMapper.apply(row, "e");
        entity.setInternalUser(userMapper.apply(row, "internalUser"));
        entity.setCity(cityMapper.apply(row, "city"));
        return entity;
    }

    @Override
    public <S extends ApplicationUser> Mono<S> save(S entity) {
        return super.save(entity).flatMap((S e) -> updateRelations(e));
    }

    protected <S extends ApplicationUser> Mono<S> updateRelations(S entity) {
        Mono<Void> result = entityManager
            .updateLinkTable(
                favoriteApplicationUserLink,
                entity.getId(),
                entity.getFavoriteApplicationUsers().stream().map(ApplicationUser::getId)
            )
            .then();
        result =
            result.and(
                entityManager.updateLinkTable(favoriteOfferLink, entity.getId(), entity.getFavoriteOffers().stream().map(Offer::getId))
            );
        return result.thenReturn(entity);
    }

    @Override
    public Mono<Void> deleteById(Long entityId) {
        return deleteRelations(entityId).then(super.deleteById(entityId));
    }

    protected Mono<Void> deleteRelations(Long entityId) {
        return entityManager
            .deleteFromLinkTable(favoriteApplicationUserLink, entityId)
            .and(entityManager.deleteFromLinkTable(favoriteOfferLink, entityId));
    }
}

package me.krft.frontend.repository;

import static org.springframework.data.relational.core.query.Criteria.where;

import io.r2dbc.spi.Row;
import io.r2dbc.spi.RowMetadata;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.function.BiFunction;
import me.krft.frontend.domain.ApplicationUserBadge;
import me.krft.frontend.repository.rowmapper.ApplicationUserBadgeRowMapper;
import me.krft.frontend.repository.rowmapper.ApplicationUserRowMapper;
import me.krft.frontend.repository.rowmapper.BadgeRowMapper;
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
 * Spring Data R2DBC custom repository implementation for the ApplicationUserBadge entity.
 */
@SuppressWarnings("unused")
class ApplicationUserBadgeRepositoryInternalImpl
    extends SimpleR2dbcRepository<ApplicationUserBadge, Long>
    implements ApplicationUserBadgeRepositoryInternal {

    private final DatabaseClient db;
    private final R2dbcEntityTemplate r2dbcEntityTemplate;
    private final EntityManager entityManager;

    private final ApplicationUserRowMapper applicationuserMapper;
    private final BadgeRowMapper badgeMapper;
    private final ApplicationUserBadgeRowMapper applicationuserbadgeMapper;

    private static final Table entityTable = Table.aliased("application_user_badge", EntityManager.ENTITY_ALIAS);
    private static final Table applicationUserTable = Table.aliased("application_user", "applicationUser");
    private static final Table badgeTable = Table.aliased("badge", "badge");

    public ApplicationUserBadgeRepositoryInternalImpl(
        R2dbcEntityTemplate template,
        EntityManager entityManager,
        ApplicationUserRowMapper applicationuserMapper,
        BadgeRowMapper badgeMapper,
        ApplicationUserBadgeRowMapper applicationuserbadgeMapper,
        R2dbcEntityOperations entityOperations,
        R2dbcConverter converter
    ) {
        super(
            new MappingRelationalEntityInformation(converter.getMappingContext().getRequiredPersistentEntity(ApplicationUserBadge.class)),
            entityOperations,
            converter
        );
        this.db = template.getDatabaseClient();
        this.r2dbcEntityTemplate = template;
        this.entityManager = entityManager;
        this.applicationuserMapper = applicationuserMapper;
        this.badgeMapper = badgeMapper;
        this.applicationuserbadgeMapper = applicationuserbadgeMapper;
    }

    @Override
    public Flux<ApplicationUserBadge> findAllBy(Pageable pageable) {
        return createQuery(pageable, null).all();
    }

    RowsFetchSpec<ApplicationUserBadge> createQuery(Pageable pageable, Condition whereClause) {
        List<Expression> columns = ApplicationUserBadgeSqlHelper.getColumns(entityTable, EntityManager.ENTITY_ALIAS);
        columns.addAll(ApplicationUserSqlHelper.getColumns(applicationUserTable, "applicationUser"));
        columns.addAll(BadgeSqlHelper.getColumns(badgeTable, "badge"));
        SelectFromAndJoinCondition selectFrom = Select
            .builder()
            .select(columns)
            .from(entityTable)
            .leftOuterJoin(applicationUserTable)
            .on(Column.create("application_user_id", entityTable))
            .equals(Column.create("id", applicationUserTable))
            .leftOuterJoin(badgeTable)
            .on(Column.create("badge_id", entityTable))
            .equals(Column.create("id", badgeTable));
        // we do not support Criteria here for now as of https://github.com/jhipster/generator-jhipster/issues/18269
        String select = entityManager.createSelect(selectFrom, ApplicationUserBadge.class, pageable, whereClause);
        return db.sql(select).map(this::process);
    }

    @Override
    public Flux<ApplicationUserBadge> findAll() {
        return findAllBy(null);
    }

    @Override
    public Mono<ApplicationUserBadge> findById(Long id) {
        Comparison whereClause = Conditions.isEqual(entityTable.column("id"), Conditions.just(id.toString()));
        return createQuery(null, whereClause).one();
    }

    private ApplicationUserBadge process(Row row, RowMetadata metadata) {
        ApplicationUserBadge entity = applicationuserbadgeMapper.apply(row, "e");
        entity.setApplicationUser(applicationuserMapper.apply(row, "applicationUser"));
        entity.setBadge(badgeMapper.apply(row, "badge"));
        return entity;
    }

    @Override
    public <S extends ApplicationUserBadge> Mono<S> save(S entity) {
        return super.save(entity);
    }
}

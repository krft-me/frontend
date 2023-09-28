package me.krft.frontend.repository;

import static org.springframework.data.relational.core.query.Criteria.where;

import io.r2dbc.spi.Row;
import io.r2dbc.spi.RowMetadata;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.UUID;
import java.util.function.BiFunction;
import me.krft.frontend.domain.Showcase;
import me.krft.frontend.repository.rowmapper.ApplicationUserOfferRowMapper;
import me.krft.frontend.repository.rowmapper.ShowcaseRowMapper;
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
 * Spring Data R2DBC custom repository implementation for the Showcase entity.
 */
@SuppressWarnings("unused")
class ShowcaseRepositoryInternalImpl extends SimpleR2dbcRepository<Showcase, Long> implements ShowcaseRepositoryInternal {

    private final DatabaseClient db;
    private final R2dbcEntityTemplate r2dbcEntityTemplate;
    private final EntityManager entityManager;

    private final ApplicationUserOfferRowMapper applicationuserofferMapper;
    private final ShowcaseRowMapper showcaseMapper;

    private static final Table entityTable = Table.aliased("showcase", EntityManager.ENTITY_ALIAS);
    private static final Table applicationUserOfferTable = Table.aliased("application_user_offer", "applicationUserOffer");

    public ShowcaseRepositoryInternalImpl(
        R2dbcEntityTemplate template,
        EntityManager entityManager,
        ApplicationUserOfferRowMapper applicationuserofferMapper,
        ShowcaseRowMapper showcaseMapper,
        R2dbcEntityOperations entityOperations,
        R2dbcConverter converter
    ) {
        super(
            new MappingRelationalEntityInformation(converter.getMappingContext().getRequiredPersistentEntity(Showcase.class)),
            entityOperations,
            converter
        );
        this.db = template.getDatabaseClient();
        this.r2dbcEntityTemplate = template;
        this.entityManager = entityManager;
        this.applicationuserofferMapper = applicationuserofferMapper;
        this.showcaseMapper = showcaseMapper;
    }

    @Override
    public Flux<Showcase> findAllBy(Pageable pageable) {
        return createQuery(pageable, null).all();
    }

    RowsFetchSpec<Showcase> createQuery(Pageable pageable, Condition whereClause) {
        List<Expression> columns = ShowcaseSqlHelper.getColumns(entityTable, EntityManager.ENTITY_ALIAS);
        columns.addAll(ApplicationUserOfferSqlHelper.getColumns(applicationUserOfferTable, "applicationUserOffer"));
        SelectFromAndJoinCondition selectFrom = Select
            .builder()
            .select(columns)
            .from(entityTable)
            .leftOuterJoin(applicationUserOfferTable)
            .on(Column.create("application_user_offer_id", entityTable))
            .equals(Column.create("id", applicationUserOfferTable));
        // we do not support Criteria here for now as of https://github.com/jhipster/generator-jhipster/issues/18269
        String select = entityManager.createSelect(selectFrom, Showcase.class, pageable, whereClause);
        return db.sql(select).map(this::process);
    }

    @Override
    public Flux<Showcase> findAll() {
        return findAllBy(null);
    }

    @Override
    public Mono<Showcase> findById(Long id) {
        Comparison whereClause = Conditions.isEqual(entityTable.column("id"), Conditions.just(id.toString()));
        return createQuery(null, whereClause).one();
    }

    private Showcase process(Row row, RowMetadata metadata) {
        Showcase entity = showcaseMapper.apply(row, "e");
        entity.setApplicationUserOffer(applicationuserofferMapper.apply(row, "applicationUserOffer"));
        return entity;
    }

    @Override
    public <S extends Showcase> Mono<S> save(S entity) {
        return super.save(entity);
    }
}

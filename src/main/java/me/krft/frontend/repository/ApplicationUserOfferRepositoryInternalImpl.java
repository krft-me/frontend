package me.krft.frontend.repository;

import static org.springframework.data.relational.core.query.Criteria.where;

import io.r2dbc.spi.Row;
import io.r2dbc.spi.RowMetadata;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.function.BiFunction;
import me.krft.frontend.domain.ApplicationUserOffer;
import me.krft.frontend.repository.rowmapper.ApplicationUserOfferRowMapper;
import me.krft.frontend.repository.rowmapper.ApplicationUserRowMapper;
import me.krft.frontend.repository.rowmapper.OfferRowMapper;
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
 * Spring Data R2DBC custom repository implementation for the ApplicationUserOffer entity.
 */
@SuppressWarnings("unused")
class ApplicationUserOfferRepositoryInternalImpl
    extends SimpleR2dbcRepository<ApplicationUserOffer, Long>
    implements ApplicationUserOfferRepositoryInternal {

    private final DatabaseClient db;
    private final R2dbcEntityTemplate r2dbcEntityTemplate;
    private final EntityManager entityManager;

    private final OfferRowMapper offerMapper;
    private final ApplicationUserRowMapper applicationuserMapper;
    private final ApplicationUserOfferRowMapper applicationuserofferMapper;

    private static final Table entityTable = Table.aliased("application_user_offer", EntityManager.ENTITY_ALIAS);
    private static final Table offerTable = Table.aliased("offer", "offer");
    private static final Table applicationUserTable = Table.aliased("application_user", "applicationUser");

    public ApplicationUserOfferRepositoryInternalImpl(
        R2dbcEntityTemplate template,
        EntityManager entityManager,
        OfferRowMapper offerMapper,
        ApplicationUserRowMapper applicationuserMapper,
        ApplicationUserOfferRowMapper applicationuserofferMapper,
        R2dbcEntityOperations entityOperations,
        R2dbcConverter converter
    ) {
        super(
            new MappingRelationalEntityInformation(converter.getMappingContext().getRequiredPersistentEntity(ApplicationUserOffer.class)),
            entityOperations,
            converter
        );
        this.db = template.getDatabaseClient();
        this.r2dbcEntityTemplate = template;
        this.entityManager = entityManager;
        this.offerMapper = offerMapper;
        this.applicationuserMapper = applicationuserMapper;
        this.applicationuserofferMapper = applicationuserofferMapper;
    }

    @Override
    public Flux<ApplicationUserOffer> findAllBy(Pageable pageable) {
        return createQuery(pageable, null).all();
    }

    RowsFetchSpec<ApplicationUserOffer> createQuery(Pageable pageable, Condition whereClause) {
        List<Expression> columns = ApplicationUserOfferSqlHelper.getColumns(entityTable, EntityManager.ENTITY_ALIAS);
        columns.addAll(OfferSqlHelper.getColumns(offerTable, "offer"));
        columns.addAll(ApplicationUserSqlHelper.getColumns(applicationUserTable, "applicationUser"));
        SelectFromAndJoinCondition selectFrom = Select
            .builder()
            .select(columns)
            .from(entityTable)
            .leftOuterJoin(offerTable)
            .on(Column.create("offer_id", entityTable))
            .equals(Column.create("id", offerTable))
            .leftOuterJoin(applicationUserTable)
            .on(Column.create("application_user_id", entityTable))
            .equals(Column.create("id", applicationUserTable));
        // we do not support Criteria here for now as of https://github.com/jhipster/generator-jhipster/issues/18269
        String select = entityManager.createSelect(selectFrom, ApplicationUserOffer.class, pageable, whereClause);
        return db.sql(select).map(this::process);
    }

    @Override
    public Flux<ApplicationUserOffer> findAll() {
        return findAllBy(null);
    }

    @Override
    public Mono<ApplicationUserOffer> findById(Long id) {
        Comparison whereClause = Conditions.isEqual(entityTable.column("id"), Conditions.just(id.toString()));
        return createQuery(null, whereClause).one();
    }

    private ApplicationUserOffer process(Row row, RowMetadata metadata) {
        ApplicationUserOffer entity = applicationuserofferMapper.apply(row, "e");
        entity.setOffer(offerMapper.apply(row, "offer"));
        entity.setApplicationUser(applicationuserMapper.apply(row, "applicationUser"));
        return entity;
    }

    @Override
    public <S extends ApplicationUserOffer> Mono<S> save(S entity) {
        return super.save(entity);
    }
}

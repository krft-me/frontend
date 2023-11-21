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
import me.krft.frontend.domain.Offer;
import me.krft.frontend.repository.rowmapper.MachineRowMapper;
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
 * Spring Data R2DBC custom repository implementation for the Offer entity.
 */
@SuppressWarnings("unused")
class OfferRepositoryInternalImpl extends SimpleR2dbcRepository<Offer, Long> implements OfferRepositoryInternal {

    private final DatabaseClient db;
    private final R2dbcEntityTemplate r2dbcEntityTemplate;
    private final EntityManager entityManager;

    private final MachineRowMapper machineMapper;
    private final OfferRowMapper offerMapper;

    private static final Table entityTable = Table.aliased("offer", EntityManager.ENTITY_ALIAS);
    private static final Table machineTable = Table.aliased("machine", "machine");

    public OfferRepositoryInternalImpl(
        R2dbcEntityTemplate template,
        EntityManager entityManager,
        MachineRowMapper machineMapper,
        OfferRowMapper offerMapper,
        R2dbcEntityOperations entityOperations,
        R2dbcConverter converter
    ) {
        super(
            new MappingRelationalEntityInformation(converter.getMappingContext().getRequiredPersistentEntity(Offer.class)),
            entityOperations,
            converter
        );
        this.db = template.getDatabaseClient();
        this.r2dbcEntityTemplate = template;
        this.entityManager = entityManager;
        this.machineMapper = machineMapper;
        this.offerMapper = offerMapper;
    }

    @Override
    public Flux<Offer> findAllBy(Pageable pageable) {
        return createQuery(pageable, null).all();
    }

    RowsFetchSpec<Offer> createQuery(Pageable pageable, Condition whereClause) {
        List<Expression> columns = OfferSqlHelper.getColumns(entityTable, EntityManager.ENTITY_ALIAS);
        columns.addAll(MachineSqlHelper.getColumns(machineTable, "machine"));
        SelectFromAndJoinCondition selectFrom = Select
            .builder()
            .select(columns)
            .from(entityTable)
            .leftOuterJoin(machineTable)
            .on(Column.create("machine_id", entityTable))
            .equals(Column.create("id", machineTable));
        // we do not support Criteria here for now as of https://github.com/jhipster/generator-jhipster/issues/18269
        String select = entityManager.createSelect(selectFrom, Offer.class, pageable, whereClause);
        return db.sql(select).map(this::process);
    }

    @Override
    public Flux<Offer> findAll() {
        return findAllBy(null);
    }

    @Override
    public Mono<Offer> findById(Long id) {
        Comparison whereClause = Conditions.isEqual(entityTable.column("id"), Conditions.just(id.toString()));
        return createQuery(null, whereClause).one();
    }

    private Offer process(Row row, RowMetadata metadata) {
        Offer entity = offerMapper.apply(row, "e");
        entity.setMachine(machineMapper.apply(row, "machine"));
        return entity;
    }

    @Override
    public <S extends Offer> Mono<S> save(S entity) {
        return super.save(entity);
    }
}

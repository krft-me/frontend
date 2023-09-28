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
import me.krft.frontend.domain.Machine;
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
 * Spring Data R2DBC custom repository implementation for the Machine entity.
 */
@SuppressWarnings("unused")
class MachineRepositoryInternalImpl extends SimpleR2dbcRepository<Machine, Long> implements MachineRepositoryInternal {

    private final DatabaseClient db;
    private final R2dbcEntityTemplate r2dbcEntityTemplate;
    private final EntityManager entityManager;

    private final OfferRowMapper offerMapper;
    private final MachineRowMapper machineMapper;

    private static final Table entityTable = Table.aliased("machine", EntityManager.ENTITY_ALIAS);
    private static final Table offerTable = Table.aliased("offer", "offer");

    public MachineRepositoryInternalImpl(
        R2dbcEntityTemplate template,
        EntityManager entityManager,
        OfferRowMapper offerMapper,
        MachineRowMapper machineMapper,
        R2dbcEntityOperations entityOperations,
        R2dbcConverter converter
    ) {
        super(
            new MappingRelationalEntityInformation(converter.getMappingContext().getRequiredPersistentEntity(Machine.class)),
            entityOperations,
            converter
        );
        this.db = template.getDatabaseClient();
        this.r2dbcEntityTemplate = template;
        this.entityManager = entityManager;
        this.offerMapper = offerMapper;
        this.machineMapper = machineMapper;
    }

    @Override
    public Flux<Machine> findAllBy(Pageable pageable) {
        return createQuery(pageable, null).all();
    }

    RowsFetchSpec<Machine> createQuery(Pageable pageable, Condition whereClause) {
        List<Expression> columns = MachineSqlHelper.getColumns(entityTable, EntityManager.ENTITY_ALIAS);
        columns.addAll(OfferSqlHelper.getColumns(offerTable, "offer"));
        SelectFromAndJoinCondition selectFrom = Select
            .builder()
            .select(columns)
            .from(entityTable)
            .leftOuterJoin(offerTable)
            .on(Column.create("offer_id", entityTable))
            .equals(Column.create("id", offerTable));
        // we do not support Criteria here for now as of https://github.com/jhipster/generator-jhipster/issues/18269
        String select = entityManager.createSelect(selectFrom, Machine.class, pageable, whereClause);
        return db.sql(select).map(this::process);
    }

    @Override
    public Flux<Machine> findAll() {
        return findAllBy(null);
    }

    @Override
    public Mono<Machine> findById(Long id) {
        Comparison whereClause = Conditions.isEqual(entityTable.column("id"), Conditions.just(id.toString()));
        return createQuery(null, whereClause).one();
    }

    private Machine process(Row row, RowMetadata metadata) {
        Machine entity = machineMapper.apply(row, "e");
        entity.setOffer(offerMapper.apply(row, "offer"));
        return entity;
    }

    @Override
    public <S extends Machine> Mono<S> save(S entity) {
        return super.save(entity);
    }
}

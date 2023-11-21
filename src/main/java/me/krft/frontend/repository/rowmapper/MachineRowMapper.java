package me.krft.frontend.repository.rowmapper;

import io.r2dbc.spi.Row;
import java.util.function.BiFunction;
import me.krft.frontend.domain.Machine;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link Machine}, with proper type conversions.
 */
@Service
public class MachineRowMapper implements BiFunction<Row, String, Machine> {

    private final ColumnConverter converter;

    public MachineRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link Machine} stored in the database.
     */
    @Override
    public Machine apply(Row row, String prefix) {
        Machine entity = new Machine();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setName(converter.fromRow(row, prefix + "_name", String.class));
        entity.setCategoryId(converter.fromRow(row, prefix + "_category_id", Long.class));
        return entity;
    }
}

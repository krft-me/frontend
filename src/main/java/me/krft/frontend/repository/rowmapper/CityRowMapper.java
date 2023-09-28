package me.krft.frontend.repository.rowmapper;

import io.r2dbc.spi.Row;
import java.util.function.BiFunction;
import me.krft.frontend.domain.City;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link City}, with proper type conversions.
 */
@Service
public class CityRowMapper implements BiFunction<Row, String, City> {

    private final ColumnConverter converter;

    public CityRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link City} stored in the database.
     */
    @Override
    public City apply(Row row, String prefix) {
        City entity = new City();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setName(converter.fromRow(row, prefix + "_name", String.class));
        entity.setRegionId(converter.fromRow(row, prefix + "_region_id", Long.class));
        return entity;
    }
}

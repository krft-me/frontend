package me.krft.frontend.repository.rowmapper;

import io.r2dbc.spi.Row;
import java.util.function.BiFunction;
import me.krft.frontend.domain.Country;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link Country}, with proper type conversions.
 */
@Service
public class CountryRowMapper implements BiFunction<Row, String, Country> {

    private final ColumnConverter converter;

    public CountryRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link Country} stored in the database.
     */
    @Override
    public Country apply(Row row, String prefix) {
        Country entity = new Country();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setName(converter.fromRow(row, prefix + "_name", String.class));
        return entity;
    }
}

package me.krft.frontend.repository.rowmapper;

import io.r2dbc.spi.Row;
import java.util.function.BiFunction;
import me.krft.frontend.domain.Offer;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link Offer}, with proper type conversions.
 */
@Service
public class OfferRowMapper implements BiFunction<Row, String, Offer> {

    private final ColumnConverter converter;

    public OfferRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link Offer} stored in the database.
     */
    @Override
    public Offer apply(Row row, String prefix) {
        Offer entity = new Offer();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setName(converter.fromRow(row, prefix + "_name", String.class));
        entity.setMachineId(converter.fromRow(row, prefix + "_machine_id", Long.class));
        return entity;
    }
}

package me.krft.frontend.repository.rowmapper;

import io.r2dbc.spi.Row;
import java.util.function.BiFunction;
import me.krft.frontend.domain.Rating;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link Rating}, with proper type conversions.
 */
@Service
public class RatingRowMapper implements BiFunction<Row, String, Rating> {

    private final ColumnConverter converter;

    public RatingRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link Rating} stored in the database.
     */
    @Override
    public Rating apply(Row row, String prefix) {
        Rating entity = new Rating();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setRate(converter.fromRow(row, prefix + "_rate", Double.class));
        entity.setComment(converter.fromRow(row, prefix + "_comment", String.class));
        entity.setApplicationUserOfferId(converter.fromRow(row, prefix + "_application_user_offer_id", Long.class));
        return entity;
    }
}

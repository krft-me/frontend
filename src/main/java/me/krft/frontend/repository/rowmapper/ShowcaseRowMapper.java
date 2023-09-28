package me.krft.frontend.repository.rowmapper;

import io.r2dbc.spi.Row;
import java.util.UUID;
import java.util.function.BiFunction;
import me.krft.frontend.domain.Showcase;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link Showcase}, with proper type conversions.
 */
@Service
public class ShowcaseRowMapper implements BiFunction<Row, String, Showcase> {

    private final ColumnConverter converter;

    public ShowcaseRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link Showcase} stored in the database.
     */
    @Override
    public Showcase apply(Row row, String prefix) {
        Showcase entity = new Showcase();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setImageId(converter.fromRow(row, prefix + "_image_id", UUID.class));
        entity.setApplicationUserOfferId(converter.fromRow(row, prefix + "_application_user_offer_id", Long.class));
        return entity;
    }
}

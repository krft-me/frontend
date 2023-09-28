package me.krft.frontend.repository.rowmapper;

import io.r2dbc.spi.Row;
import java.util.function.BiFunction;
import me.krft.frontend.domain.Tag;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link Tag}, with proper type conversions.
 */
@Service
public class TagRowMapper implements BiFunction<Row, String, Tag> {

    private final ColumnConverter converter;

    public TagRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link Tag} stored in the database.
     */
    @Override
    public Tag apply(Row row, String prefix) {
        Tag entity = new Tag();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setLabel(converter.fromRow(row, prefix + "_label", String.class));
        entity.setApplicationUserOfferId(converter.fromRow(row, prefix + "_application_user_offer_id", Long.class));
        return entity;
    }
}

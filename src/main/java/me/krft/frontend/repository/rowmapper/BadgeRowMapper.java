package me.krft.frontend.repository.rowmapper;

import io.r2dbc.spi.Row;
import java.util.function.BiFunction;
import me.krft.frontend.domain.Badge;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link Badge}, with proper type conversions.
 */
@Service
public class BadgeRowMapper implements BiFunction<Row, String, Badge> {

    private final ColumnConverter converter;

    public BadgeRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link Badge} stored in the database.
     */
    @Override
    public Badge apply(Row row, String prefix) {
        Badge entity = new Badge();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setLabel(converter.fromRow(row, prefix + "_label", String.class));
        entity.setPictureContentType(converter.fromRow(row, prefix + "_picture_content_type", String.class));
        entity.setPicture(converter.fromRow(row, prefix + "_picture", byte[].class));
        return entity;
    }
}

package me.krft.frontend.repository.rowmapper;

import io.r2dbc.spi.Row;
import java.time.Instant;
import java.util.function.BiFunction;
import me.krft.frontend.domain.ApplicationUserBadge;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link ApplicationUserBadge}, with proper type conversions.
 */
@Service
public class ApplicationUserBadgeRowMapper implements BiFunction<Row, String, ApplicationUserBadge> {

    private final ColumnConverter converter;

    public ApplicationUserBadgeRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link ApplicationUserBadge} stored in the database.
     */
    @Override
    public ApplicationUserBadge apply(Row row, String prefix) {
        ApplicationUserBadge entity = new ApplicationUserBadge();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setObtentionDate(converter.fromRow(row, prefix + "_obtention_date", Instant.class));
        entity.setApplicationUserId(converter.fromRow(row, prefix + "_application_user_id", Long.class));
        entity.setBadgeId(converter.fromRow(row, prefix + "_badge_id", Long.class));
        return entity;
    }
}

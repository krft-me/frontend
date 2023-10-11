package me.krft.frontend.repository.rowmapper;

import io.r2dbc.spi.Row;
import java.util.function.BiFunction;
import me.krft.frontend.domain.ApplicationUser;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link ApplicationUser}, with proper type conversions.
 */
@Service
public class ApplicationUserRowMapper implements BiFunction<Row, String, ApplicationUser> {

    private final ColumnConverter converter;

    public ApplicationUserRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link ApplicationUser} stored in the database.
     */
    @Override
    public ApplicationUser apply(Row row, String prefix) {
        ApplicationUser entity = new ApplicationUser();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setFirstName(converter.fromRow(row, prefix + "_first_name", String.class));
        entity.setLastName(converter.fromRow(row, prefix + "_last_name", String.class));
        entity.setPseudo(converter.fromRow(row, prefix + "_pseudo", String.class));
        entity.setAverageRating(converter.fromRow(row, prefix + "_average_rating", Double.class));
        entity.setInternalUserId(converter.fromRow(row, prefix + "_internal_user_id", String.class));
        entity.setCityId(converter.fromRow(row, prefix + "_city_id", Long.class));
        return entity;
    }
}

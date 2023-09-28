package me.krft.frontend.repository.rowmapper;

import io.r2dbc.spi.Row;
import java.util.function.BiFunction;
import me.krft.frontend.domain.ApplicationUserOffer;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link ApplicationUserOffer}, with proper type conversions.
 */
@Service
public class ApplicationUserOfferRowMapper implements BiFunction<Row, String, ApplicationUserOffer> {

    private final ColumnConverter converter;

    public ApplicationUserOfferRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link ApplicationUserOffer} stored in the database.
     */
    @Override
    public ApplicationUserOffer apply(Row row, String prefix) {
        ApplicationUserOffer entity = new ApplicationUserOffer();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setDescription(converter.fromRow(row, prefix + "_description", String.class));
        entity.setOfferId(converter.fromRow(row, prefix + "_offer_id", Long.class));
        entity.setApplicationUserId(converter.fromRow(row, prefix + "_application_user_id", Long.class));
        return entity;
    }
}

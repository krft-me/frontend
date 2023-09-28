package me.krft.frontend.repository;

import java.util.ArrayList;
import java.util.List;
import org.springframework.data.relational.core.sql.Column;
import org.springframework.data.relational.core.sql.Expression;
import org.springframework.data.relational.core.sql.Table;

public class ShowcaseSqlHelper {

    public static List<Expression> getColumns(Table table, String columnPrefix) {
        List<Expression> columns = new ArrayList<>();
        columns.add(Column.aliased("id", table, columnPrefix + "_id"));
        columns.add(Column.aliased("image_id", table, columnPrefix + "_image_id"));

        columns.add(Column.aliased("application_user_offer_id", table, columnPrefix + "_application_user_offer_id"));
        return columns;
    }
}

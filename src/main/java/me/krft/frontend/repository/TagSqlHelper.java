package me.krft.frontend.repository;

import java.util.ArrayList;
import java.util.List;
import org.springframework.data.relational.core.sql.Column;
import org.springframework.data.relational.core.sql.Expression;
import org.springframework.data.relational.core.sql.Table;

public class TagSqlHelper {

    public static List<Expression> getColumns(Table table, String columnPrefix) {
        List<Expression> columns = new ArrayList<>();
        columns.add(Column.aliased("id", table, columnPrefix + "_id"));
        columns.add(Column.aliased("label", table, columnPrefix + "_label"));

        columns.add(Column.aliased("application_user_offer_id", table, columnPrefix + "_application_user_offer_id"));
        return columns;
    }
}

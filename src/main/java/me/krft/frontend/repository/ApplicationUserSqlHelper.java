package me.krft.frontend.repository;

import java.util.ArrayList;
import java.util.List;
import org.springframework.data.relational.core.sql.Column;
import org.springframework.data.relational.core.sql.Expression;
import org.springframework.data.relational.core.sql.Table;

public class ApplicationUserSqlHelper {

    public static List<Expression> getColumns(Table table, String columnPrefix) {
        List<Expression> columns = new ArrayList<>();
        columns.add(Column.aliased("id", table, columnPrefix + "_id"));
        columns.add(Column.aliased("first_name", table, columnPrefix + "_first_name"));
        columns.add(Column.aliased("last_name", table, columnPrefix + "_last_name"));
        columns.add(Column.aliased("pseudo", table, columnPrefix + "_pseudo"));
        columns.add(Column.aliased("average_rating", table, columnPrefix + "_average_rating"));

        columns.add(Column.aliased("internal_user_id", table, columnPrefix + "_internal_user_id"));
        columns.add(Column.aliased("city_id", table, columnPrefix + "_city_id"));
        return columns;
    }
}

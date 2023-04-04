import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("Employee", (table: Knex.TableBuilder) => {
        table.dropColumns("Gender", "Address", "Email", "Birthday");
        table.date("dateJoin");
        table.date("dateLeave");
        table.string("Roles").nullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("Employee");
}

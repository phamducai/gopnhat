import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("Employee_SubDepartment", (table: Knex.TableBuilder) => {
        table.integer("isLeader", 1).notNullable().defaultTo(0);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("Employee_SubDepartment");
}

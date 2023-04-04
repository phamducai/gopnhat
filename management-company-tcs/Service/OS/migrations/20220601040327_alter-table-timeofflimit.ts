import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("TimeOffLimit", (table: Knex.TableBuilder) => {
        table.date("Date").notNullable().defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("TimeOffLimit");
}


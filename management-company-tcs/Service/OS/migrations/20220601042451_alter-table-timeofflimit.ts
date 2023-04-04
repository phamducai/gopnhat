import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("TimeOffLimit", (table: Knex.TableBuilder) => {
        table.integer("Status", 1).defaultTo(1);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("TimeOffLimit");
}


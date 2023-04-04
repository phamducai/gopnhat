import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("TimeOffLimit", (table: Knex.TableBuilder) => {
        table.dropColumn("Status");
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("TimeOffLimit");
}


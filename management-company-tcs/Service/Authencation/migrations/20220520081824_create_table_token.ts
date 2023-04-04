import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('Tokens', (table: Knex.TableBuilder) => {
        table.uuid("GUID").primary().defaultTo(knex.raw("(UUID())"));
        table.text("tokenLogin");
        table.string("resetPasswordToken");
        table.uuid("accountGuid").references('GUID').inTable('Account').defaultTo(knex.raw("(UUID())"));
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("Tokens");
}


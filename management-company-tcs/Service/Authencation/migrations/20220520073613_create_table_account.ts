import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('Account', (table: Knex.TableBuilder) => {
        table.uuid("GUID").primary().defaultTo(knex.raw("(UUID())"));
        table.string("username").unique().notNullable();
        table.string("password").notNullable();
        table.integer("status").notNullable();
        table.string("createdBy").notNullable();
        table.timestamp("validDate");
        table.timestamp("outDated");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("Account");
}


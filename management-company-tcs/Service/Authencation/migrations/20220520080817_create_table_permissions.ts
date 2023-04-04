import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('Permissions', (table: Knex.TableBuilder) => {
        table.uuid("GUID").primary().defaultTo(knex.raw("(UUID())"));
        table.string("action");
        table.uuid("updatedByGuid");
        table.uuid("createdByGuid");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("Permissions");
}


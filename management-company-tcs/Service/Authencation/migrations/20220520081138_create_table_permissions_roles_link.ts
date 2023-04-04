import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('PermissionRoleLinks', (table: Knex.TableBuilder) => {
        table.uuid("GUID").primary().defaultTo(knex.raw("(UUID())"));
        table.uuid("permissionGuid").references('GUID').inTable('Permissions').defaultTo(knex.raw("(UUID())"));
        table.uuid("roleGuid").references('GUID').inTable('Roles').defaultTo(knex.raw("(UUID())"));
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("PermissionRoleLinks");
}


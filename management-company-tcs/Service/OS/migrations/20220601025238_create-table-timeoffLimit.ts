import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("TimeOffLimit", (table: Knex.TableBuilder) => {
        table.uuid("GUID").primary().defaultTo(knex.raw("(UUID())"));
        table.uuid("EmployeeGuid").references("GUID").inTable("Employee");
        table.integer("TimeOffLimit").defaultTo(14);
        table.integer("Status", 1).defaultTo(1);
        table.uuid("CreatedBy");
        table.uuid("UpdatedBy");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("TimeOffLimit");
}


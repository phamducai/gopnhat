import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable("Company", (table: Knex.TableBuilder) => {
		table.uuid("GUID").primary().defaultTo(knex.raw("(UUID())"));
		table.string("Name").unique().notNullable();
		table.string("Code").unique().notNullable();
		table.timestamp("created_at").defaultTo(knex.fn.now());
		table.timestamp("updated_at").defaultTo(knex.fn.now());
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable("Company");
}

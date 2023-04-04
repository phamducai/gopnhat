import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable("Department", (table: Knex.TableBuilder) => {
		table.uuid("GUID").primary().defaultTo(knex.raw("(UUID())"));
		table.string("Name").notNullable();
		table.string("Code", 20).unique().notNullable();
		table.integer("Status").notNullable();
		table
			.uuid("CompanyGuid")
			.references("GUID")
			.inTable("Company")
			.defaultTo(knex.raw("(UUID())"));
		table.timestamp("created_at").defaultTo(knex.fn.now());
		table.timestamp("updated_at").defaultTo(knex.fn.now());
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable("Department");
}

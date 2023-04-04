import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable("Manager", (table: Knex.TableBuilder) => {
		table.uuid("CreatedBy").references("GUID").inTable("Employee");
		table.uuid("UpdatedBy").references("GUID").inTable("Employee");
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable("Manager");
}

import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable("Department", (table: Knex.TableBuilder) => {
		table.uuid("ManagerGuid").references("GUID").inTable("Employee");
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.alterTable("Department", (table: Knex.TableBuilder) => {
		table.dropColumn("ManagerGuid");
	});
}

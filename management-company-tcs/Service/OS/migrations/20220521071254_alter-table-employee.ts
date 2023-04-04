import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable("Employee", (table: Knex.TableBuilder) => {
		table.string("Phone");
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable("Employee");
}

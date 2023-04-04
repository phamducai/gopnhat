import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable("Employee", (table: Knex.TableBuilder) => {
		table.string("Address").notNullable();
		table.string("Email").notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable("Employee");
}

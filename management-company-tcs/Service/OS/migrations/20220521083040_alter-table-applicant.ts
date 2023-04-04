import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable("Applicant", (table: Knex.TableBuilder) => {
		table.integer("Status");
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable("Applicant");
}

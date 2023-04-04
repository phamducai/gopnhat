import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable("TimeOffItem", (table: Knex.TableBuilder) => {
		table.date("RejectDate").nullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable("TimeOffItem");
}

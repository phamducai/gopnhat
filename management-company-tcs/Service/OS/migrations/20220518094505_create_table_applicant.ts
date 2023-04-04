import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable("Applicant", (table: Knex.TableBuilder) => {
		table.uuid("GUID").primary().defaultTo(knex.raw("(UUID())"));
		table.uuid("ReviewBy");
		table.uuid("CreatedBy");
		table.text("Conditions");
		table.text("Reason");
		table.string("Images");
		table.timestamp("created_at").defaultTo(knex.fn.now());
		table.timestamp("updated_at").defaultTo(knex.fn.now());
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable("Applicant");
}

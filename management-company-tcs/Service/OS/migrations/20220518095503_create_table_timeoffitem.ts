import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable(
		"TimeOffItem",
		(table: Knex.TableBuilder) => {
			table.uuid("GUID").primary().defaultTo(knex.raw("(UUID())"));
			table.dateTime("Date").notNullable();
			table.float("Hours").notNullable();
			table.integer("Status").notNullable();
			table.integer("MorningNoon");
			table.uuid("ApplicantGuid").references("GUID").inTable("Applicant");
			table
				.uuid("TimeOffTypeGuid")
				.references("GUID")
				.inTable("TimeOffType");
			table.timestamp("created_at").defaultTo(knex.fn.now());
			table.timestamp("updated_at").defaultTo(knex.fn.now());
		}
	);
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable("TimeOffItem");
}

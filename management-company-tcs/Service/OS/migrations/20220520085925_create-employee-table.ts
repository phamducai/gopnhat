import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable("Employee", (table: Knex.TableBuilder) => {
		table.uuid("GUID").primary().defaultTo(knex.raw("(UUID())"));
		table.integer("Status").notNullable();
		table.string("Code").notNullable();
		table.string("FirstName").notNullable();
		table.string("LastName").notNullable();
		table.uuid("DepartmentGuid").references("GUID").inTable("Department");
		table
			.uuid("SubDepartmentGuid")
			.references("GUID")
			.inTable("SubDepartment");
		table.timestamp("created_at").defaultTo(knex.fn.now());
		table.timestamp("updated_at").defaultTo(knex.fn.now());
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable("Employee");
}

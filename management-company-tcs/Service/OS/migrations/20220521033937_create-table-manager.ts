import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable("Manager", (table: Knex.TableBuilder) => {
		table.uuid("GUID").primary().defaultTo(knex.raw("(UUID())"));
		table.uuid("EmployeeGuid").references("GUID").inTable("Employee");
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
	return knex.schema.dropTable("Manager");
}

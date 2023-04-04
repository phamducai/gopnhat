import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable(
		"SubDepartment",
		(table: Knex.TableBuilder) => {
			table.uuid("GUID").primary().defaultTo(knex.raw("(UUID())"));
			table.string("Name").notNullable();
			table.string("Code").notNullable();
			table.uuid("ParentGuid");
			table.integer("Status").notNullable();
			table.integer("GLevel");
			table
				.uuid("DepartmentGuid")
				.references("GUID")
				.inTable("Department");
			table.timestamp("created_at").defaultTo(knex.fn.now());
			table.timestamp("updated_at").defaultTo(knex.fn.now());
		}
	);
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable("SubDepartment");
}

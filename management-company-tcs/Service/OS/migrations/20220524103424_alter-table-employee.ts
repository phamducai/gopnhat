import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable("Employee", (table: Knex.TableBuilder) => {
        table.dropForeign("DepartmentGuid");
        table.dropForeign("SubDepartmentGuid");
		table
			.uuid("DepartmentGuid")
			.references("GUID")
			.inTable("Department")
			.nullable().alter();
		table
			.uuid("SubDepartmentGuid")
			.references("GUID")
			.inTable("SubDepartment")
			.nullable().alter();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable("Employee");
}

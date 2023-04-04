import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable(
		"Employee_SubDepartment",
		(table: Knex.TableBuilder) => {
			table.dropForeign("CreatedBy");
			table.dropColumn("CreatedBy");
            table.dropForeign("UpdatedBy");
			table.dropColumn("UpdatedBy");
		}
	);
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable("Employee_SubDepartment");
}

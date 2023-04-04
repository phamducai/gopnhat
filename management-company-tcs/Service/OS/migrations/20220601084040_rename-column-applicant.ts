import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("Applicant", (table: Knex.TableBuilder) => {
        table.dropForeign("TimeOffType");
        table.dropColumn("TimeOffType");
        table.uuid("TimeOffTypeGuid").references("GUID").inTable("TimeOffType");

    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("Applicant");
}

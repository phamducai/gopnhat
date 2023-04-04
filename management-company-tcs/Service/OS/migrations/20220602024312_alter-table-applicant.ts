import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("Applicant", (table: Knex.TableBuilder) => {
        table.string("RejectReason").nullable();
        table.date("RejectDate");
        table.uuid("FirstReview").references("GUID").inTable("Employee").nullable().alter();
        table.uuid("SecondReview").references("GUID").inTable("Employee").nullable().alter();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("Applicant");
}

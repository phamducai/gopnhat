import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("Applicant", (table: Knex.TableBuilder) => {
        table.date("DateTo");
        table.date("DateFrom");
        table.uuid("FirstReview");
        table.uuid("SecondReview");
        table.dropColumns("Date","ReviewBy");
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("Applicant");
}

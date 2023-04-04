/* eslint-disable @typescript-eslint/no-empty-function */
import { Knex } from "knex";

exports.up = function (knex: Knex) {
  return Promise.all([knex.schema.createTable("users", function (table) {
      table.string("first_name", 255).notNullable();
      table.string("last_name", 255).notNullable();
      table.increments("id").primary();
    }).then(() => {
      return knex("users").insert([
        {first_name: "A", last_name: "A", id: "1"},
        {first_name: "B", last_name: "BB", id: "2" },
        {first_name: "C", last_name: "CCC",  id: "3"},
        {first_name: "D", last_name: "DDDD",  id: "4"}
      ]);
    }),
    knex.schema.createTable("products", function (table) {
      table.decimal("price").notNullable();
      table.string("name", 1000).notNullable();
      table.increments("id").primary();
      table.integer("user_id").unsigned();
      table.foreign("user_id").references("users");
  }).then(() => {
    return knex("products").insert([
      {price: "10", name: "A", user_id: "1", id: "1"},
      {price: "20", name: "BB", user_id: "2", id: "2"},
      {price: "30", name: "CCC", user_id: "3", id: "3"},
      {price: "40", name: "DDDD", user_id: "4", id: "4"}
  ]);
 }),
]);
};

export async function down(knex: Knex): Promise<void> {
   knex.schema.dropTable("product");
   knex.schema.dropTable("users");
}


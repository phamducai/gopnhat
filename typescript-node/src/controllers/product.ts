/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import knex from "knex";
import db from "../config/db";
import { ProductRepository } from "../repository/ProductRepository";

/**
 * Home page.
 * @route GET /
 */
export const index = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
    const { id } = req.params;
    const repository = new ProductRepository(db, "product");
    const result = await db.join("users", "users.id", "=", "products.user_id")
        .select("*", "*");

    return res.status(200).json({
        message: result,
    });
};
export const allProduct = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
    const repository = new ProductRepository(db, "product");
    const result = await repository.qb.select("*").from("users").innerJoin("products", "products.user_id", "=", "users.id");

    return res.status(200).json({
        message: result,
    });
};

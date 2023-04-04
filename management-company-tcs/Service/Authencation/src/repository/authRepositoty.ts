import { KnexRepository } from "../utils/baseReponsitory";
import db from "../config/db";
import { Login } from "../models/login";
import { Token } from "../models/token";
import { AccountRepository } from "./accountRepository";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { Decoded } from "../models/decoded";
import { AccountRoleLinkRepository } from "./accountRoleLinkRepository";

dotenv.config();
export class AuthRepository extends KnexRepository<Token> {
  private readonly _AccountRepository = new AccountRepository();
  private readonly _AccountRoleLinkRepository = new AccountRoleLinkRepository();
  constructor() {
    super(db, "Tokens");
  }

  public async Login(data: Login) {
    const { username, password } = data;
    const result = await this._AccountRepository.findAccountByUsername(username);
    const roles = await this._AccountRoleLinkRepository.qb.select('Roles.name').join("Roles", { "AccountRoleLinks.roleGuid": "Roles.GUID" }).where("AccountRoleLinks.accountGuid", result.GUID);
    const checkPassword = bcrypt.compareSync(password, result.password);
    if (checkPassword) {
      const token = await jwt.sign(
        { username: username, GUID: result.GUID, role: roles },
        process.env.KEY,
        { expiresIn: "3h" }
      );
      await this.create({ tokenLogin: token, accountGuid: result.GUID });
      return { token };
    } else {
      return {
        status: false,
        message: "Username or password not found",
      };
    }
  }

  public async AccessToken(token: string) {
    const checkTokenDB = await this.findToken(token);
    if (checkTokenDB) {
      let decodeToken: any = jwt.decode(token);
      const refreshToken = jwt.sign(
        { username: decodeToken.Username, GUID: decodeToken.GUID },
        process.env.KEY,
        { expiresIn: "3h" }
      );
      await this.create({ tokenLogin: token, accountGuid: decodeToken.GUID });
      return { token: refreshToken };
    }
  }

  public async verifyToken(tokenLogin: string): Promise<any> {
    const checkTokenDB = await this.findToken(tokenLogin);
    if (checkTokenDB) {
      return jwt.verify(
        tokenLogin,
        process.env.KEY,
        function (err: any, decoded: Decoded) {
          if (err) {
            console.error(err.toString());
            //if (err) throw new Error(err)
            return { message: "Unauthorized access.", err };
          } else {
            return {
              status: true,
              data: decoded,
            };
          }
        }
      );
    } else {
      const message = {
        status: false,
        error: "Token invalid",
      };
      return message;
    }
  }
}

import { responseLogin } from "../models/responseLogin";
import { Login } from "../models/login";

export default interface IAccount {
  Login(data: Login): void;
  AccessToken(token: string): void;
  verifyToken(token: string): void;
}

import { Login } from "../models/login";
import ILogin from "../interface/ILogin";
import { AuthRepository } from "../repository/authRepositoty";

class AuthService implements ILogin {
  private readonly _AuthRepository: AuthRepository;
  constructor() {
    this._AuthRepository = new AuthRepository();
  }

  async Login(data: Login) {
    return await this._AuthRepository.Login(data);
  }

  async AccessToken(token: string) {
    return await this._AuthRepository.AccessToken(token);
  }

  async verifyToken(token: string) {
    return await this._AuthRepository.verifyToken(token);
  }
}

export const AuthServices = new AuthService();

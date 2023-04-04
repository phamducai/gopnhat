import { AccountRepository } from "../repository/accountRepository";
import { Account } from "../models/account";
import IAccount from "../interface/IAccount";
import dotenv from "dotenv";
import { updatePassword } from "../models/updatePassword";
import bcrypt from "bcryptjs";
dotenv.config();
class AccountService implements IAccount {
	private readonly _AccountRepository: AccountRepository;
	constructor() {
		this._AccountRepository = new AccountRepository();
	}

	findAll = async (): Promise<any> => {
		return await this._AccountRepository.findAll();
	};

	insertAccount = async (data: Account) => {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(data.password, salt);
		data.password = hashedPassword;
		try {
			return await this._AccountRepository.create(data);
		} catch (error) {
			const accountGUID =
				await this._AccountRepository.findAccountByUsername(
					data.username
				);
			if (accountGUID) {
				const message = {
					status: false,
					GUID: accountGUID.GUID,
					error: error.sqlMessage,
				};
				return message;
			}
			return {
				status: false,
				error: error.sqlMessage,
			};
		}
	};

	updateAccountByGuid = async (guid: string, data: Account): Promise<any> => {
		return await this._AccountRepository.update(guid, data);
	};

	deleteAccountById = async (guid: string): Promise<boolean> => {
		return await this._AccountRepository.update(guid, { status: 0 });
	};

	updatePassword = async (
		Username: string,
		data: updatePassword
	): Promise<any> => {
		const result = await this._AccountRepository.findAccountByUsername(
			Username
		);
		const checkPassword = bcrypt.compareSync(
			process.env.KEY,
			result.password
		);
		if (checkPassword) {
			const password = await this._AccountRepository.update(result.GUID, {
				password: data.passwordNew,
			});
			return password;
		} else {
			return false;
		}
	};
}

export const AccountServices = new AccountService();

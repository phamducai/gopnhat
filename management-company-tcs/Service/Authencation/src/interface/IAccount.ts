import { updatePassword } from "../models/updatePassword";
import { Account } from "../models/account";

export default interface IAccount {
    insertAccount(data: Account): void
    updateAccountByGuid(guid: string, data: Account): Promise<Boolean>
    deleteAccountById(guid: string): Promise<Boolean>
    updatePassword(guid: string, data: updatePassword): Promise<Boolean>
}
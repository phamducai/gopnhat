import { Company } from "../models/company";

export default interface ICompany {
	insertCompany(data: Company): Promise<Company>;
	findAllCompany(): Promise<Company[]>;
	updateCompanyByGuid(guid: string, data: Company): Promise<boolean>;
	deleteCompanyById(guid: string): Promise<boolean>;
}

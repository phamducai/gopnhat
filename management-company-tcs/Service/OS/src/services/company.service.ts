import { CompanyRepository } from "../repository/CompanyRepository";
import { Company } from "../models/company";
import ICompany from "../interface/ICompany";
import { createGuid } from "../utils/helper";

class CompanyService implements ICompany {
	private readonly _CompanyRepository: CompanyRepository;
	constructor() {
		this._CompanyRepository = new CompanyRepository();
	}

	insertCompany = async (data: Company) => {
		data.GUID = createGuid();
		return await this._CompanyRepository.create(data);
	};

	findAllCompany = async () => {
		return await this._CompanyRepository.findAll();
	};

	updateCompanyByGuid = async (guid: string, data: Company): Promise<any> => {
		return await this._CompanyRepository.update(guid, data);
	};

	deleteCompanyById = async (guid: string): Promise<boolean> => {
		return await this._CompanyRepository.delete(guid);
	};
}

export const CompanyServices = new CompanyService();

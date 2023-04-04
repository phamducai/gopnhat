import { Employee } from "../models/employee";

export default interface IEmployee {
	insert(data: Employee): Promise<Employee>;
	findAll(): Promise<Employee[]>;
	update(guid: string, data: Employee): Promise<boolean>;
	deleteMe(guid: string): Promise<boolean>;
}

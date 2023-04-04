import IEmployee from "../interface/IEmployee";
import { Employee, ListApplicantByEmployee, TimeOffInfo } from "../models/employee";
import { InforDepartment } from "../models/expandResponse/inforDepartment";
import { ApplicantRepository } from "../repository/ApplicantRepository";
import { EmployeeRepository } from "../repository/EmployeeRepository";
import { getDaysInMonth, IPaginate, IPagination, paginate, SearchTimeOff } from "../utils/helper";

class EmployeeService implements IEmployee {
    private readonly _EmployeeRepository: EmployeeRepository;
    private readonly _ApplicantRepository: ApplicantRepository;
    constructor() {
        this._EmployeeRepository = new EmployeeRepository();
        this._ApplicantRepository = new ApplicantRepository();
    }

    insert = (data: Employee) => {
        return this._EmployeeRepository.create(data);
    };

    findAll = async () => {
        const res = await this._EmployeeRepository.findAll();
        return res;
    };

    findOne = (guid: string) => {
        return this._EmployeeRepository.getOneByGuid(guid);
    };

    findByAccount = (accountGuid: string) => {
        return this._EmployeeRepository.getProfileByAccountGuid(accountGuid);
    };
    update = (guid: string, data: Employee): Promise<boolean> => {
        return this._EmployeeRepository.update(guid, data);
    };

    deleteMe = (guid: string): Promise<boolean> => {
        return this._EmployeeRepository.update(guid, { Status: 0 });
    };

    getAllEmployeeByDepartmentGuid = async (guid: string, pagination: IPaginate, formSearch: SearchTimeOff): Promise<ListApplicantByEmployee> => {
        let dateFrom = new Date();
        let dateTo = new Date(new Date().getDate() + 30);
        let firstNameEmployee = "";
        let lastNameEmployee = "";

        const pagin = paginate(pagination);
        const getPagination = await this._EmployeeRepository.totalCountEmployee(
            guid
        );
        const resPagination: IPagination = {
            current: pagin.pageSize + 1,
            pageSize: pagin.pageNumber,
            total: getPagination.total,
            TotalPages:
                (getPagination.total / pagin.pageNumber) % 2 === 0
                    ? getPagination.total / pagin.pageNumber
                    : Math.floor(getPagination.total / pagin.pageNumber) + 1,
            HasNext: false,
            HasPrevious: false,
        };
        if (formSearch) {
            if (formSearch.dateFrom) {
                dateFrom = new Date(formSearch.dateFrom);
            }
            if (formSearch.dateTo) {
                dateTo = new Date(formSearch.dateTo);
            } else {
                dateTo.setDate(new Date().getDate() + 30);
            }

            if (formSearch.month) {
                const result = getDaysInMonth(formSearch.month, new Date().getFullYear());
                dateFrom = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
                dateTo = new Date(new Date().getFullYear(), new Date().getMonth(), result.length);
            }
            if (formSearch.name) {
                firstNameEmployee = formSearch.name.substring(0, formSearch.name.lastIndexOf(" "));
                lastNameEmployee = formSearch.name.substring(formSearch.name.lastIndexOf(" "), formSearch.name.length);
            }
        }

        const dataSearch = {
            firstName: firstNameEmployee && firstNameEmployee,
            lastName: lastNameEmployee && lastNameEmployee,
            dateFrom: dateFrom && dateFrom,
            dateTo: dateTo && dateTo
        };
        const resultEmployee = await this._EmployeeRepository.getAllEmployee(
            guid,
            pagin,
            dataSearch
        );

        const employee: InforDepartment[] = [];
        resultEmployee.filter(item => {
            employee.push({
                GUID: item.GUID,
                Name: item.Name,
                LastName: item.LastName,
                FirstName: item.FirstName,
                ParentGuid: item.ParentGuid
            });
        });
        const listGuid = resultEmployee.map((item) => item.GUID);

        const applicantData = await this._ApplicantRepository.getAllApplicant(listGuid, dateFrom, dateTo);
        return {
            listDataEmployee: employee,
            listApplicantByEmployee: applicantData,
            pagination: resPagination,
        };
    };

    getTimeOffLimitInfo = async (employeeGuid: string): Promise<TimeOffInfo> => {
        const timeOffLimit = await this._EmployeeRepository.getTimeOffLimit(
            employeeGuid
        );
        const approvedDays =
            await this._EmployeeRepository.getApprovedTimeOffDays(employeeGuid);
        let totalApprovedDays = 0;
        if (approvedDays)
            totalApprovedDays = [...approvedDays].reduce((prev, curr) => {
                return prev + curr.ApprovedDays;
            }, 0);
        return {
            timeOffLimit: timeOffLimit[0]?.TimeOffLimit,
            approvedDays: totalApprovedDays,
            availableDays: Number(timeOffLimit[0].TimeOffLimit) - Number(totalApprovedDays ?? 0),
        };
    };
}

export const EmployeeServices = new EmployeeService();

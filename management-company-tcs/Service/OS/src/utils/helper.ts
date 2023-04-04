// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
import { Response } from "express";
import { v4 as uuid } from "uuid";

export interface IPaginate {
	pageNumber: number,
	pageSize: number
}

export interface SearchTimeOff {
    name?: string,
    month?: number,
    dateFrom?: Date,
    dateTo?: Date
}
export interface QuerySearch {
    firstName?: string,
    lastName?: string,
    dateFrom?: Date,
    dateTo?: Date
}
export interface IPagination {
	current: number;
	pageSize: number;
	total: number;
	TotalPages: number;
	HasNext: boolean;
	HasPrevious: boolean;
}

export const createGuid = (): string => {
	const GUID: string = uuid();
	return GUID;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const messageBoolean = (status: boolean, res: Response) => {
	if (status == true) {
		return res.status(200).json({
			status: true,
			data: true,
		});
	} else {
		return res.status(400).json({
			status: false,
			data: false,
		});
	}
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const messageData = (status: boolean, result: any, res: Response) => {
	if (status == true) {
		return res.status(200).json({
			status: true,
			data: result,
		});
	} else {
		const { code, errno, sqlMessage } = result;
		const filteredRes = { code, errno, sqlMessage };
		return res.status(400).json({
			status: false,
			error: filteredRes,
		});
	}
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const removeAccents = (str: string) => {
	const AccentsMap = [
		"aàảãáạăằẳẵắặâầẩẫấậ",
		"AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
		"dđ",
		"DĐ",
		"eèẻẽéẹêềểễếệ",
		"EÈẺẼÉẸÊỀỂỄẾỆ",
		"iìỉĩíị",
		"IÌỈĨÍỊ",
		"oòỏõóọôồổỗốộơờởỡớợ",
		"OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
		"uùủũúụưừửữứự",
		"UÙỦŨÚỤƯỪỬỮỨỰ",
		"yỳỷỹýỵ",
		"YỲỶỸÝỴ",
	];
	for (let i = 0; i < AccentsMap.length; i++) {
		const re = new RegExp("[" + AccentsMap[i].substring(1) + "]", "g");
		const char = AccentsMap[i][0];
		str = str.replace(re, char);
	}
	return str;
};

export const paginate = ({pageNumber, pageSize} : IPaginate): IPaginate => {
	const page = (pageNumber) * 1 || 1;
	const limit = pageSize || 10;
	const skip = (page - 1) * limit;
	return {pageSize: skip, pageNumber: limit};
};

export function getDaysInMonth(month: number, year: number): Date[] {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }
export function querySearchToJson(queryString: string): any {
    const pairs = queryString.substring(1).split("&");
    const array = pairs.map((el) => {
        const parts = el.split("=");
        return parts;
    });
    return Object.entries(array);
}
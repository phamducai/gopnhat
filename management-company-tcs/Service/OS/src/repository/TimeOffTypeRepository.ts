import { KnexRepository } from "../utils/baseReponsitory";
import db from "../config/db";
import { TimeOffType } from "../models/timeOffType";

export class TimeOffTypeRepository extends KnexRepository<TimeOffType> {
	constructor() {
		super(db, "TimeOffType");
	}
}

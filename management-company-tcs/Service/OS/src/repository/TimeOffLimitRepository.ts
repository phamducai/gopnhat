import { KnexRepository } from "../utils/baseReponsitory";
import db from "../config/db";
import { TimeOffLimit } from "../models/timeOffLimit";

export class TimeOffLimitRepository extends KnexRepository<TimeOffLimit> {
    constructor() {
        super(db, "TimeOffLimit");
    }
}

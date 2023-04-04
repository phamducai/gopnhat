
export interface Account {
    GUID?: string
    username: string
    password: string,
    status: number,
    createBy: string,
    validDate: Date,
    outDated: Date
}
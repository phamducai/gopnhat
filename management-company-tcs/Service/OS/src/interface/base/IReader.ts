export default interface IReader<T> {
    findByCondition(item: Partial<T>): Promise<T[]>
    findOne(id: string | Partial<T>): Promise<T>
    exist(id: string | Partial<T>): Promise<boolean>
}
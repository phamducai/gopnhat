export default interface IReader<T> {
    find(item: Partial<T>): Promise<T[]>
    findOne(id: string | Partial<T>): Promise<T>
    exist(id: string | Partial<T>): Promise<boolean>
}
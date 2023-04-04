export default interface IWriter<T> {
    create(item: any): void
    createMany(item: Omit<T, "GUID">[]): Promise<T[]>
    update(id: string, item: Partial<T>): Promise<boolean>
    updateByCondition(dk: Partial<T>, item: Partial<T>): Promise<boolean>
    delete(id: string): Promise<boolean>
}
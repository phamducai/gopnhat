export default interface IWriter<T> {
    create(item: Omit<T, "id">): Promise<T>
    createMany(item: Omit<T, "id">[]): Promise<T[]>
    update(id: string, item: Partial<T>): Promise<boolean>
    delete(id: string): Promise<boolean>
}
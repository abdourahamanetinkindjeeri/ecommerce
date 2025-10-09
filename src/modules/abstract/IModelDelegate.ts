export default interface IModelDelegate<T, CreateDTO, UpdateDTO> {
  create(args: { data: CreateDTO }): Promise<T>;
  findMany(args?: any): Promise<T[]>;
  findUnique(args: { where: { id: string }; include?: any }): Promise<T | null>;
  update(args: { where: { id: string }; data: UpdateDTO }): Promise<T>;
  delete(args: { where: { id: string } }): Promise<T>;
}

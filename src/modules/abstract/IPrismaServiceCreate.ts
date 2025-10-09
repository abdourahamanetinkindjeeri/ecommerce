export default interface IPrismaServiceCreate<T, CreateDTO, UpdateDTO> {
  create(data: CreateDTO): Promise<T>;
  update(id:  string, data: Partial<UpdateDTO>): Promise<T>;
}

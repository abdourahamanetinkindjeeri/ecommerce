import IPrismaServiceCreate from "./IPrismaServiceCreate.js";
import IPrismaServiceRead from "./IPrismaServiceRead.js";

export default interface IPrismaService<T, CreateDTO = T, UpdateDTO = T>
  extends IPrismaServiceCreate<T, CreateDTO, UpdateDTO>,
    IPrismaServiceRead<T> {
  delete(id:  string): Promise<T>;
  findManyWithFilter(args: any): Promise<T[]>;
}

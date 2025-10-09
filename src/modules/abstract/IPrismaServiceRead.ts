export default interface IPrismaServiceRead<T> {
  findAll(options?: {
    skip?: number;
    take?: number;
    search?: string;
  }): Promise<T[]>;
  findById(id: string): Promise<T | null>;
}

export class Server {
  constructor(
    public instanceType: string,
    public name: string,
    public status: string,
    public started: Date
  ) {}
}

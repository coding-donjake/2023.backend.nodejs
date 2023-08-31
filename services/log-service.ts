import PrismaService from "./prisma-service";

class LogService {
  static instance: LogService;
  private prismaService: PrismaService = PrismaService.getInstance();
  
  static getInstance(): LogService {
    if(!LogService.instance) {
      LogService.instance = new LogService();
      console.log('New log service instance has been created.');
    }
    return LogService.instance;
  }

  public logEvent(type: string, userId: string, content: object) {
    this.prismaService.prisma.log.create({
      data: {
        type: type,
        content: content,
        userId: userId,
      }
    });
  }
}

export default LogService;
import PrismaService from './prisma-service';
import HashService from './hash-service';
import jwt from 'jsonwebtoken';

class AuthenticationService {
  static instance: AuthenticationService;
  
  private hashService: HashService = HashService.getInstance();
  private prismaService: PrismaService = PrismaService.getInstance();

  static getInstance(): AuthenticationService {
    if(!AuthenticationService.instance) {
      AuthenticationService.instance = new AuthenticationService();
      console.log('New authentication service instance has been created.');
    }
    return AuthenticationService.instance;
  }

  public authenticateUser = async (username: string, password: string) => {
    try {
      const user = await this.prismaService.prisma.user.findUnique({
        where: {username: username},
      });
      if (!user) { return false; }
      const passwordMatches = await this.hashService.comparePasswords(password, user.password);
      return passwordMatches;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  public generateAuthenticationToken = (userId: string, expiration: String) => {
    const secretKey = process.env.SECRET_KEY;
    const token: String = jwt.sign({userId}, process.env.SECRET_KEY!);
  }
}

export default AuthenticationService;
import express, { Request, Response } from 'express';
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
      if (!user) return false;
      const passwordMatches = await this.hashService.comparePasswords(password, user.password);
      if (!passwordMatches) return false;
      return user;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  public generateAccessToken = (content: object, expiration: string) => {
    const token: string = jwt.sign(content, process.env.SECRET_KEY!, {expiresIn: expiration});
    return token;
  }

  public generateRefreshToken = (content: object) => {
    const token: string = jwt.sign(content, process.env.SECRET_KEY!);
    return token;
  }

  public verifyToken(req: Request, res: Response, next: any) {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided.' });
    jwt.verify(token, process.env.SECRET_KEY!, (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Failed to authenticate token.' });
      req.body.decodedToken = decoded;
      next();
    });
  }
}

export default AuthenticationService;
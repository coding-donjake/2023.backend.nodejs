import { Request, Response } from 'express';
import { Router } from 'express';
import PrismaService from '../services/prisma-service';
import HashService from '../services/hash-service';
import AuthenticationService from '../services/authentication-service';

class UserRouter {
  public router: Router;
  private authService: AuthenticationService = AuthenticationService.getInstance();
  private hashService: HashService = HashService.getInstance();
  private prismaService: PrismaService = PrismaService.getInstance();

  private createRoute: string = '/create';
  private loginRoute: string = '/login';
  private updateRoute: string = '/update';

  constructor() {
    this.router = Router();
    this.setCreateRoute();
    this.setLoginRoute();
    this.setUpdateRoute();
  }

  private setCreateRoute = async () => {
    this.router.post(this.createRoute, async (req: Request, res: Response) => {
      req.body.password = await this.hashService.hashPassword(req.body.password, 10);
      try {
        console.log(`Creating user using the following data: ${JSON.stringify(req.body)}`);
        const user = await this.prismaService.prisma.user.create({
          data: req.body,
        });
        console.log(`User created: ${JSON.stringify(user)}`);
        res.status(200).json({ id: user.id });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          status: 'server error',
          msg: error,
        });
      }
    });
  }

  private setLoginRoute = async () => {
    this.router.post(this.loginRoute, async (req: Request, res: Response) => {
      try {
        console.log(`Login attempt using ${req.body.username}`);
        const {username, password} = req.body;
        const user = await this.authService.authenticateUser(username, password);
        if (!user) {
          res.status(401).send();
          return;
        }
        console.log(`User ${username} successfully logged in.`);
        res.status(200).json({
          accessToken: this.authService.generateAccessToken(user, process.env.TOKEN_DURATION!),
          refreshToken: this.authService.generateRefreshToken(user),
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          status: 'server error',
          msg: error,
        });
      }
    });
  }

  private setUpdateRoute = async () => {
    this.router.post(this.updateRoute, [this.authService.verifyToken, this.authService.verifyUser, this.authService.verifyAdmin], async (req: Request, res: Response) => {
      try {
        this.prismaService.prisma.user // complete for update
        res.status(200).send();
      } catch (error) {
        console.error(error);
        res.status(500).json({
          status: 'server error',
          msg: error,
        });
      }
    });
  }
}

export default UserRouter;
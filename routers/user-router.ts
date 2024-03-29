import { Request, Response } from 'express';
import { Router } from 'express';
import PrismaService from '../services/prisma-service';
import HashService from '../services/hash-service';
import AuthenticationService from '../services/authentication-service';
import LogService from '../services/log-service';

class UserRouter {
  public router: Router;
  private authService: AuthenticationService = AuthenticationService.getInstance();
  private hashService: HashService = HashService.getInstance();
  private logService: LogService = LogService.getInstance();
  private prismaService: PrismaService = PrismaService.getInstance();

  private createRoute: string = '/create';
  private getRoute: string = '/get';
  private loginRoute: string = '/login';
  private searchRoute: string = '/search';
  private updateRoute: string = '/update';

  constructor() {
    this.router = Router();
    this.setCreateRoute();
    this.setGetRoute();
    this.setLoginRoute();
    this.setSearchRoute();
    this.setUpdateRoute();
  }

  private setCreateRoute = async () => {
    this.router.post(this.createRoute, [this.authService.verifyToken, this.authService.verifyUser, this.authService.verifyAdmin], async (req: Request, res: Response) => {
      req.body.data.password = await this.hashService.hashPassword(req.body.data.password, 10);
      try {
        console.log(`Creating user using the following data: ${JSON.stringify(req.body.data)}`);
        const user = await this.prismaService.prisma.user.create({
          data: req.body.data,
        });
        console.log(`User created: ${JSON.stringify(user)}`);
        req.body.data.id = user.id;
        this.logService.logEvent('create', req.body.decodedToken.id, req.body.data);
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

  private setGetRoute = async () => {
    this.router.get(this.getRoute, [this.authService.verifyToken, this.authService.verifyUser, this.authService.verifyAdmin], async (req: Request, res: Response) => {
      try {
        let result = await this.prismaService.prisma.user.findMany({
          where: {
            OR: [
              {status: 'ok'},
              {status: 'unverified'},
            ],
          },
          select: {
            username: true,
            UserInformation: {
              select: {
                lastname: true,
                firstname: true,
                middlename: true,
                suffix: true,
                gender: true,
                birthdate: true,
                userId: true,
              },
            },
          },
        });
        if (!result) return res.status(400).send();
        console.log(`${result.length} users send to user ${req.body.decodedToken.id}.`);
        res.status(200).json({data: result});
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

  private setSearchRoute = async () => {
    this.router.get(this.searchRoute, [this.authService.verifyToken, this.authService.verifyUser, this.authService.verifyAdmin], async (req: Request, res: Response) => {
      try {
        let result = await this.prismaService.prisma.user.findMany({
          where: {
            OR: [
              {status: 'ok'},
              {status: 'unverified'},
            ],
          },
          select: {
            username: true,
            UserInformation: {
              where: {
                OR: [
                  {lastname: req.body.key},
                  {firstname: req.body.key},
                  {middlename: req.body.key},
                ],
              },
              select: {
                lastname: true,
                firstname: true,
                middlename: true,
                suffix: true,
                gender: true,
                birthdate: true,
              },
            },
          },
        });
        if (!result) return res.status(400).send();
        console.log(`${result.length} users send to user ${req.body.decodedToken.id}.`);
        res.status(200).json({data: result});
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
        console.log(`Updating user ${req.body.id} using the following data: ${JSON.stringify(req.body.data)}`);
        let result = await this.prismaService.prisma.user.update({
          where: {id: req.body.id},
          data: req.body.data,
        });
        if (!result) return res.status(400).send();
        console.log(`User ${req.body.id} updated.`);
        req.body.data.id = req.body.id;
        this.logService.logEvent('update', req.body.decodedToken.id, req.body.data);
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
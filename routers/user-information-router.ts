import { Request, Response } from 'express';
import { Router } from 'express';
import PrismaService from '../services/prisma-service';
import AuthenticationService from '../services/authentication-service';
import LogService from '../services/log-service';

class UserInformationRouter {
  public router: Router;
  private authService: AuthenticationService = AuthenticationService.getInstance();
  private logService: LogService = LogService.getInstance();
  private prismaService: PrismaService = PrismaService.getInstance();

  private createRoute: string = '/create';
  private updateRoute: string = '/update';

  constructor() {
    this.router = Router();
    this.setCreateRoute();
    this.setUpdateRoute();
  }

  private setCreateRoute = async () => {
    this.router.post(this.createRoute, [this.authService.verifyToken, this.authService.verifyUser, this.authService.verifyAdmin], async (req: Request, res: Response) => {
      try {
        console.log(`Creating user information using the following data: ${JSON.stringify(req.body)}`);
        const userInformation = await this.prismaService.prisma.userInformation.create({
          data: req.body.data,
        });
        console.log(`User information created: ${JSON.stringify(userInformation)}`);
        req.body.data.id = userInformation.id;
        this.logService.logEvent('create', req.body.decodedToken.id, req.body.data);
        res.status(200).json({ id: userInformation.id });
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
        console.log(`Updating user information ${req.body.id} using the following data: ${JSON.stringify(req.body.data)}`);
        let result = await this.prismaService.prisma.userInformation.update({
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

export default UserInformationRouter;
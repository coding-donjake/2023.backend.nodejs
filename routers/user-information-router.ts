import { Request, Response } from 'express';
import { Router } from 'express';
import PrismaService from '../services/prisma-service';

class UserInformationRouter {
  public router: Router;
  private createRoute: string = '/create';
  private prismaService: PrismaService = PrismaService.getInstance();

  constructor() {
    this.router = Router();
    this.setCreateRoute();
  }

  private setCreateRoute = async () => {
    this.router.post(this.createRoute, async (req: Request, res: Response) => {
      try {
        console.log(`Creating user information using the following data: ${JSON.stringify(req.body)}`);
        const user = await this.prismaService.prisma.userInformation.create({
          data: req.body,
        });
        console.log(`User information created: ${JSON.stringify(user)}`);
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
}

export default UserInformationRouter;
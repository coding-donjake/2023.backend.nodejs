import { Request, Response } from 'express';
import { Router } from 'express';
import PrismaService from '../services/prisma-service';

class AdminRouter {
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
        console.log(`Creating admin using the following data: ${JSON.stringify(req.body)}`);
        const admin = await this.prismaService.prisma.admin.create({
          data: req.body,
        });
        console.log(`Admin created: ${JSON.stringify(admin)}`);
        res.status(200).json({ id: admin.id });
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

export default AdminRouter;
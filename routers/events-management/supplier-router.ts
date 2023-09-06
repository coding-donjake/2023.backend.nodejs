import { Request, Response } from 'express';
import { Router } from 'express';
import AuthenticationService from '../../services/authentication-service';
import LogService from '../../services/log-service';
import PrismaService from '../../services/prisma-service';

class SupplierRouter {
  public router: Router;
  private authService: AuthenticationService = AuthenticationService.getInstance();
  private logService: LogService = LogService.getInstance();
  private prismaService: PrismaService = PrismaService.getInstance();

  private createRoute: string = '/create';
  private getRoute: string = '/get';
  private removeRoute: string = '/remove';
  private updateRoute: string = '/update';

  constructor() {
    this.router = Router();
    this.setCreateRoute();
    this.setGetRoute();
    this.setRemoveRoute();
    this.setUpdateRoute();
  }

  private setCreateRoute = async () => {
    this.router.post(this.createRoute, [this.authService.verifyToken, this.authService.verifyUser, this.authService.verifyAdmin], async (req: Request, res: Response) => {
      try {
        console.log(`Creating supplier using the following data: ${JSON.stringify(req.body.data)}`);
        const supplier = await this.prismaService.prisma.supplier.create({
          data: req.body.data,
        });
        console.log(`Supplier created: ${JSON.stringify(supplier)}`);
        req.body.data.id = supplier.id;
        this.logService.logEvent('create', req.body.decodedToken.id, req.body.data);
        res.status(200).json({ id: supplier.id });
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
        let result = await this.prismaService.prisma.supplier.findMany();
        if (!result) return res.status(400).send();
        console.log(`${result.length} supplier send to user ${req.body.decodedToken.id}.`);
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

  private setRemoveRoute = async () => {
    this.router.post(this.removeRoute, [this.authService.verifyToken, this.authService.verifyUser, this.authService.verifyAdmin], async (req: Request, res: Response) => {
      try {
        console.log(`Removing supplier ${req.body.id}.`);
        let result = await this.prismaService.prisma.supplier.update({
          where: {id: req.body.id},
          data: {status: 'removed'},
        });
        if (!result) return res.status(400).send();
        console.log(`Supplier ${req.body.id} removed.`);
        req.body.data.id = req.body.id;
        this.logService.logEvent('remove', req.body.decodedToken.id, req.body.data);
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

  private setUpdateRoute = async () => {
    this.router.post(this.updateRoute, [this.authService.verifyToken, this.authService.verifyUser, this.authService.verifyAdmin], async (req: Request, res: Response) => {
      try {
        console.log(`Updating supplier ${req.body.id} using the following data: ${JSON.stringify(req.body.data)}`);
        let result = await this.prismaService.prisma.supplier.update({
          where: {id: req.body.id},
          data: req.body.data,
        });
        if (!result) return res.status(400).send();
        console.log(`Supplier ${req.body.id} updated.`);
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

export default SupplierRouter;
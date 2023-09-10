import * as dotenv from 'dotenv';
import express from 'express';
import UserRouter from './routers/user-router';
import UserInformationRouter from './routers/user-information-router';
import AdminRouter from './routers/admin-router';
import SupplyRouter from './routers/events-management/supply-router';
import CustomerRouter from './routers/events-management/customer-router';
import EventRouter from './routers/events-management/event-router';
import EventSupplyRouter from './routers/events-management/event-supply-router';
import OrderRouter from './routers/events-management/order-router';
import OrderSupplyRouter from './routers/events-management/order-supply-router';
import SupplierRouter from './routers/events-management/supplier-router';
import TaskRouter from './routers/events-management/task-router';
import AssetRouter from './routers/assets-management/asset-router';

class App {
  static instance: App;
  private express = express();

  private adminRoute: string = '/admin';
  private userRoute: string = '/user';
  private userInformationRoute: string = '/user-information';

  private adminRouter: AdminRouter;
  private userRouter: UserRouter;
  private userInformationRouter: UserInformationRouter;

  // assets management system
  private assetRoute: string = '/asset';
  private assetRouter: AssetRouter;

  // events management system
  private customerRoute: string = '/customer';
  private eventRoute: string = '/event';
  private eventSupplyRoute: string = '/event-supply';
  private orderRoute: string = '/order';
  private orderSupplyRoute: string = '/order-supply';
  private supplierRoute: string = '/supplier';
  private supplyRoute: string = '/supply';
  private taskRoute: string = '/task';

  private customerRouter: CustomerRouter;
  private eventRouter: EventRouter;
  private eventSupplyRouter: EventSupplyRouter;
  private orderRouter: OrderRouter;
  private orderSupplyRouter: OrderSupplyRouter;
  private supplierRouter: SupplierRouter;
  private supplyRouter: SupplyRouter;
  private taskRouter: TaskRouter;

  private constructor() {
    this.express.use(express.json());

    this.adminRouter = new AdminRouter();
    this.express.use(this.adminRoute, this.adminRouter.router);

    this.userRouter = new UserRouter();
    this.express.use(this.userRoute, this.userRouter.router);

    this.userInformationRouter = new UserInformationRouter();
    this.express.use(this.userInformationRoute, this.userInformationRouter.router);

    // assets management system

    this.assetRouter = new AssetRouter();
    this.express.use(this.assetRoute, this.assetRouter.router);

    // events management system

    this.customerRouter = new CustomerRouter();
    this.express.use(this.customerRoute, this.customerRouter.router);

    this.eventRouter = new EventRouter();
    this.express.use(this.eventRoute, this.eventRouter.router);

    this.eventSupplyRouter = new EventSupplyRouter();
    this.express.use(this.eventSupplyRoute, this.eventSupplyRouter.router);

    this.orderRouter = new OrderRouter();
    this.express.use(this.orderRoute, this.orderRouter.router);

    this.orderSupplyRouter = new OrderSupplyRouter();
    this.express.use(this.orderSupplyRoute, this.orderSupplyRouter.router);

    this.supplierRouter = new SupplierRouter();
    this.express.use(this.supplierRoute, this.supplierRouter.router);

    this.supplyRouter = new SupplyRouter();
    this.express.use(this.supplyRoute, this.supplyRouter.router);

    this.taskRouter = new TaskRouter();
    this.express.use(this.taskRoute, this.taskRouter.router);

    this.express.listen(process.env.PORT);
    console.log(`Running in port ${process.env.PORT}.`);
  }

  static getInstance(): App {
    if(!App.instance) {
      App.instance = new App();
      console.log('New app instance has been created.');
    }
    return App.instance;
  }
}

dotenv.config();
const app = App.getInstance();

export default app;
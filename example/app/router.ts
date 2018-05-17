import { Application } from 'egg';
import { MiddlewareConsumer } from 'egg-pig';


export default (app: Application) => {

  const { router, controller, middleware } = app;


  MiddlewareConsumer

    .setRouter(router)

    .apply(middleware['log']())

    .forRoutes(controller.cat)


}


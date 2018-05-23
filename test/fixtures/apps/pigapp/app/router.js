"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const egg_pig_1 = require("../../../../../");
exports.default = (app) => {
    const { router, controller, middleware } = app;
    egg_pig_1.MiddlewareConsumer
        .setRouter(router)
        .apply(middleware['loga']())
        .forRoutes('middleware_a/foo')
        .apply(middleware['loga'](), middleware['logb']())
        .forRoutes(controller.middlewareB)
        .apply(middleware['loga'])
        .forRoutes({path:'middleware_a/bar'},'middleware_a/foo')
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicm91dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EscUNBQTZDO0FBRzdDLGtCQUFlLENBQUMsR0FBZ0IsRUFBRSxFQUFFO0lBRWxDLE1BQU0sRUFBRSxNQUFNLEVBQUMsVUFBVSxFQUFFLFVBQVUsRUFBQyxHQUFHLEdBQUcsQ0FBQztJQUc3Qyw0QkFBa0I7U0FFZixTQUFTLENBQUMsTUFBTSxDQUFDO1NBRWpCLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztTQUUzQixTQUFTLENBQ1Isa0JBQWtCLEVBQ2xCLGtCQUFrQixDQUNuQjtTQUVBLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztTQUVqRCxTQUFTLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBRXRDLENBQUMsQ0FBQSJ9
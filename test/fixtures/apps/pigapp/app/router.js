"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    const { router } = app;
    router.get('/homes', async (ctx, next) => {
        console.log(ctx.req.headers);
        return next();
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicm91dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0JBQWUsQ0FBQyxHQUFnQixFQUFFLEVBQUU7SUFFaEMsTUFBTSxFQUFFLE1BQU0sRUFBQyxHQUFHLEdBQUcsQ0FBQztJQUN0QixNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFDLElBQUksRUFBQyxFQUFFO1FBQ25DLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QixPQUFPLElBQUksRUFBRSxDQUFDO0lBQ2xCLENBQUMsQ0FBQyxDQUFBO0FBRU4sQ0FBQyxDQUFDIn0=
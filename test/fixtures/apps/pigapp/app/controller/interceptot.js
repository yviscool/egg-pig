"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const egg_1 = require("egg");
const egg_pig_1 = require("egg-pig");
require("rxjs/add/operator/do");
let AInterceptor = class AInterceptor {
    async intercept(req, context, stream$) {
        const { parent, handler } = context;
        req.query = { id: 1 };
        return stream$.do(() => { console.log(parent, handler); });
    }
};
AInterceptor = tslib_1.__decorate([
    egg_pig_1.Interceptor()
], AInterceptor);
let BInterceptor = class BInterceptor {
    async intercept(req, _, stream$) {
        req.path = '/';
        return stream$.do(() => { });
    }
};
BInterceptor = tslib_1.__decorate([
    egg_pig_1.Interceptor()
], BInterceptor);
let CInterceptor = class CInterceptor {
    async xxxxxxxxxxx() {
    }
};
CInterceptor = tslib_1.__decorate([
    egg_pig_1.Interceptor()
], CInterceptor);
let InterceptorController = class InterceptorController extends egg_1.BaseContextClass {
    async index() {
        this.ctx.body = {
            query: this.ctx.request.query,
            path: this.ctx.request.path
        };
    }
    async body() {
        this.ctx.body = this.ctx.request.query;
    }
    async bar() {
        this.ctx.body = this.ctx.request.path;
    }
};
tslib_1.__decorate([
    egg_pig_1.Get('/'),
    egg_pig_1.UseInterceptors(BInterceptor),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], InterceptorController.prototype, "index", null);
tslib_1.__decorate([
    egg_pig_1.Get('/body'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], InterceptorController.prototype, "body", null);
tslib_1.__decorate([
    egg_pig_1.Get('/foo'),
    egg_pig_1.UseInterceptors(CInterceptor),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], InterceptorController.prototype, "bar", null);
InterceptorController = tslib_1.__decorate([
    egg_pig_1.Controller('interceptor'),
    egg_pig_1.UseInterceptors(AInterceptor)
], InterceptorController);
exports.default = InterceptorController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJjZXB0b3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlcmNlcHRvdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBdUM7QUFDdkMscUNBQTBFO0FBQzFFLGdDQUE4QjtBQUc5QixJQUFNLFlBQVksR0FBbEI7SUFDSSxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsT0FBTztRQUNqQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLE9BQU8sQ0FBQztRQUNwQyxHQUFHLENBQUMsS0FBSyxHQUFHLEVBQUMsRUFBRSxFQUFDLENBQUMsRUFBQyxDQUFDO1FBQ25CLE9BQU8sT0FBTyxDQUFDLEVBQUUsQ0FDYixHQUFHLEVBQUUsR0FBRSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQSxDQUFBLENBQUMsQ0FDdkMsQ0FBQztJQUNOLENBQUM7Q0FDSixDQUFBO0FBUkssWUFBWTtJQURqQixxQkFBVyxFQUFFO0dBQ1IsWUFBWSxDQVFqQjtBQUdELElBQU0sWUFBWSxHQUFsQjtJQUNJLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxPQUFPO1FBQzNCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO1FBQ2YsT0FBTyxPQUFPLENBQUMsRUFBRSxDQUNiLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FDWCxDQUFDO0lBQ04sQ0FBQztDQUNKLENBQUE7QUFQSyxZQUFZO0lBRGpCLHFCQUFXLEVBQUU7R0FDUixZQUFZLENBT2pCO0FBR0QsSUFBTSxZQUFZLEdBQWxCO0lBQ0ksS0FBSyxDQUFDLFdBQVc7SUFDakIsQ0FBQztDQUNKLENBQUE7QUFISyxZQUFZO0lBRGpCLHFCQUFXLEVBQUU7R0FDUixZQUFZLENBR2pCO0FBSUQsSUFBTSxxQkFBcUIsR0FBM0IsMkJBQTRCLFNBQVEsc0JBQWdCO0lBSWhELEtBQUssQ0FBQyxLQUFLO1FBQ1AsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUc7WUFDWixLQUFLLEVBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSztZQUM1QixJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSTtTQUM5QixDQUFBO0lBQ0wsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFJO1FBQ04sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO0lBQzNDLENBQUM7SUFJRCxLQUFLLENBQUMsR0FBRztRQUNMLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztJQUMxQyxDQUFDO0NBQ0osQ0FBQTtBQWhCRztJQUZDLGFBQUcsQ0FBQyxHQUFHLENBQUM7SUFDUix5QkFBZSxDQUFDLFlBQVksQ0FBQzs7OztrREFNN0I7QUFFRDtJQURDLGFBQUcsQ0FBQyxPQUFPLENBQUM7Ozs7aURBR1o7QUFJRDtJQUZDLGFBQUcsQ0FBQyxNQUFNLENBQUM7SUFDWCx5QkFBZSxDQUFDLFlBQVksQ0FBQzs7OztnREFHN0I7QUFuQkMscUJBQXFCO0lBRjFCLG9CQUFVLENBQUMsYUFBYSxDQUFDO0lBQ3pCLHlCQUFlLENBQUMsWUFBWSxDQUFDO0dBQ3hCLHFCQUFxQixDQW9CMUI7QUFHRCxrQkFBZSxxQkFBcUIsQ0FBQyJ9
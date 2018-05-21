"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const egg_1 = require("egg");
const egg_pig_1 = require("../../../../../../");
let AGuard = class AGuard {
    async canActivate(context) {
        const { getClass, getHandler } = context
        if (this.ctx.req.url === '/guard/forbiden')
            return false;
        return { parent: getClass(), handler: getHandler() };
    }
};
AGuard = tslib_1.__decorate([
    egg_pig_1.Injectable()
], AGuard);
let BGuard = class BGuard {
    canActivate(context) {
        const { getClass, getHandler } = context
        if (/guard.*?/.test(this.ctx.req.url)){
             return { parent: getClass(), handler: getHandler() };
        }
    }
};
BGuard = tslib_1.__decorate([
    egg_pig_1.Injectable()
], BGuard);
let GuardController = class GuardController extends egg_1.BaseContextClass {
    async index(query) {
        this.ctx.body = query;
    }
    async body() {
        this.ctx.body = '403';
    }
    async nothing() {
        this.ctx.body = 'nothing';
    }
};
tslib_1.__decorate([
    egg_pig_1.Get('/'),
    egg_pig_1.UseGuards(BGuard),
    tslib_1.__param(0, egg_pig_1.Query()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], GuardController.prototype, "index", null);
tslib_1.__decorate([
    egg_pig_1.Get('forbiden'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], GuardController.prototype, "body", null);
tslib_1.__decorate([
    egg_pig_1.Get('/nothing'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], GuardController.prototype, "nothing", null);
GuardController = tslib_1.__decorate([
    egg_pig_1.Controller('guard'),
    egg_pig_1.UseGuards(AGuard)
], GuardController);
exports.default = GuardController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VhcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJndWFyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBdUM7QUFDdkMscUNBQW9FO0FBR3BFLElBQU0sTUFBTSxHQUFaO0lBQ0ksS0FBSyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsT0FBTztRQUMxQixNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLE9BQU8sQ0FBQztRQUNwQyxJQUFHLEdBQUcsQ0FBQyxHQUFHLEtBQUssaUJBQWlCO1lBQUUsT0FBTyxLQUFLLENBQUM7UUFDL0MsT0FBTyxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUMsQ0FBQztJQUM3QixDQUFDO0NBQ0osQ0FBQTtBQU5LLE1BQU07SUFEWCxlQUFLLEVBQUU7R0FDRixNQUFNLENBTVg7QUFHRCxJQUFNLE1BQU0sR0FBWjtJQUNJLFdBQVcsQ0FBQyxHQUFHLEVBQUUsT0FBTztRQUNwQixNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLE9BQU8sQ0FBQztRQUNwQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEtBQUssUUFBUSxFQUFDO1lBQ3JCLE9BQU8sRUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFDLENBQUM7U0FDNUI7SUFDTCxDQUFDO0NBQ0osQ0FBQTtBQVBLLE1BQU07SUFEWCxlQUFLLEVBQUU7R0FDRixNQUFNLENBT1g7QUFJRCxJQUFNLE1BQU0sR0FBWjtJQUNJLFVBQVUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtRQUNaLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7Q0FDSixDQUFBO0FBSkssTUFBTTtJQURYLGVBQUssRUFBRTtHQUNGLE1BQU0sQ0FJWDtBQUlELElBQU0sZUFBZSxHQUFyQixxQkFBc0IsU0FBUSxzQkFBZ0I7SUFJMUMsS0FBSyxDQUFDLEtBQUssQ0FBVSxLQUFLO1FBQ3RCLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztJQUMxQixDQUFDO0lBR0QsS0FBSyxDQUFDLElBQUk7UUFDTixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7SUFDMUIsQ0FBQztJQUlELEtBQUssQ0FBQyxPQUFPO1FBQ1QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO0lBQzlCLENBQUM7Q0FDSixDQUFBO0FBZEc7SUFGQyxhQUFHLENBQUMsR0FBRyxDQUFDO0lBQ1IsbUJBQVMsQ0FBQyxNQUFNLENBQUM7SUFDTCxtQkFBQSxlQUFLLEVBQUUsQ0FBQTs7Ozs0Q0FFbkI7QUFHRDtJQURDLGFBQUcsQ0FBQyxVQUFVLENBQUM7Ozs7MkNBR2Y7QUFJRDtJQUZDLG1CQUFTLENBQUMsTUFBTSxDQUFDO0lBQ2pCLGFBQUcsQ0FBQyxVQUFVLENBQUM7Ozs7OENBR2Y7QUFqQkMsZUFBZTtJQUZwQixvQkFBVSxDQUFDLE9BQU8sQ0FBQztJQUNuQixtQkFBUyxDQUFDLE1BQU0sQ0FBQztHQUNaLGVBQWUsQ0FrQnBCO0FBR0Qsa0JBQWUsZUFBZSxDQUFDIn0=
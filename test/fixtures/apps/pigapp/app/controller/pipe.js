"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const egg_1 = require("egg");
const egg_pig_1 = require("../../../../../../");
let APipe = class APipe {
    async transform(val, context) {
        return Object.assign({}, context, { val });
    }
};
APipe = tslib_1.__decorate([
    egg_pig_1.Pipe()
], APipe);
let BPipe = class BPipe {
    transform(_, __) {
        return 1;
    }
};
BPipe = tslib_1.__decorate([
    egg_pig_1.Pipe()
], BPipe);
let CPipe = class CPipe {
    xxxxxxxxxxxxx(_, __) {
        return 1;
    }
};
CPipe = tslib_1.__decorate([
    egg_pig_1.Pipe()
], CPipe);
let PipeController = class PipeController extends egg_1.BaseContextClass {
    async index(query) {
        this.ctx.body = query;
    }
    async param(param) {
        this.ctx.body = param;
    }
    async foo(body) {
        this.ctx.body = body;
    }
};
tslib_1.__decorate([
    egg_pig_1.Get('/query/:id'),
    egg_pig_1.UsePipes(APipe),
    tslib_1.__param(0, egg_pig_1.Query()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PipeController.prototype, "index", null);
tslib_1.__decorate([
    egg_pig_1.Get('/:id'),
    tslib_1.__param(0, egg_pig_1.Param('id', BPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PipeController.prototype, "param", null);
tslib_1.__decorate([
    egg_pig_1.Post('/'),
    egg_pig_1.UsePipes(CPipe),
    tslib_1.__param(0, egg_pig_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PipeController.prototype, "foo", null);
PipeController = tslib_1.__decorate([
    egg_pig_1.Controller('pipe')
], PipeController);
exports.default = PipeController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkJBQXVDO0FBQ3ZDLHFDQUFrRjtBQUdsRixJQUFNLEtBQUssR0FBWDtJQUNFLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLE9BQU87UUFFMUIseUJBQ0ssT0FBTyxJQUNWLEdBQUcsSUFDSjtJQUNILENBQUM7Q0FDRixDQUFBO0FBUkssS0FBSztJQURWLGNBQUksRUFBRTtHQUNELEtBQUssQ0FRVjtBQUtELElBQU0sS0FBSyxHQUFYO0lBQ0UsU0FBUyxDQUFDLENBQUMsRUFBRSxFQUFFO1FBQ2IsT0FBTyxDQUFDLENBQUM7SUFDWCxDQUFDO0NBQ0YsQ0FBQTtBQUpLLEtBQUs7SUFEVixjQUFJLEVBQUU7R0FDRCxLQUFLLENBSVY7QUFHRCxJQUFNLEtBQUssR0FBWDtJQUNFLGFBQWEsQ0FBQyxDQUFDLEVBQUUsRUFBRTtRQUNqQixPQUFPLENBQUMsQ0FBQztJQUNYLENBQUM7Q0FDRixDQUFBO0FBSkssS0FBSztJQURWLGNBQUksRUFBRTtHQUNELEtBQUssQ0FJVjtBQUdELElBQU0sY0FBYyxHQUFwQixvQkFBcUIsU0FBUSxzQkFBZ0I7SUFJM0MsS0FBSyxDQUFDLEtBQUssQ0FBVSxLQUFLO1FBQ3hCLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztJQUN4QixDQUFDO0lBR0QsS0FBSyxDQUFDLEtBQUssQ0FBcUIsS0FBSztRQUNuQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7SUFDeEIsQ0FBQztJQUlELEtBQUssQ0FBQyxHQUFHLENBQVMsSUFBSTtRQUNwQixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDdkIsQ0FBQztDQUNGLENBQUE7QUFkQztJQUZDLGFBQUcsQ0FBQyxZQUFZLENBQUM7SUFDakIsa0JBQVEsQ0FBQyxLQUFLLENBQUM7SUFDSCxtQkFBQSxlQUFLLEVBQUUsQ0FBQTs7OzsyQ0FFbkI7QUFHRDtJQURDLGFBQUcsQ0FBQyxNQUFNLENBQUM7SUFDQyxtQkFBQSxlQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFBOzs7OzJDQUU5QjtBQUlEO0lBRkMsY0FBSSxDQUFDLEdBQUcsQ0FBQztJQUNULGtCQUFRLENBQUMsS0FBSyxDQUFDO0lBQ0wsbUJBQUEsY0FBSSxFQUFFLENBQUE7Ozs7eUNBRWhCO0FBakJHLGNBQWM7SUFEbkIsb0JBQVUsQ0FBQyxNQUFNLENBQUM7R0FDYixjQUFjLENBa0JuQjtBQUdELGtCQUFlLGNBQWMsQ0FBQyJ9
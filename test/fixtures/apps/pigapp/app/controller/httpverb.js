"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const egg_1 = require("egg");
const egg_pig_1 = require("egg-pig");
let HttpVerbController = class HttpVerbController extends egg_1.BaseContextClass {
    async get() {
        this.ctx.body = 'get';
    }
    async post() {
        this.ctx.body = 'post';
    }
    async head() {
        this.ctx.body = 'head';
    }
    async patch() {
        this.ctx.body = 'patch';
    }
    async put() {
        this.ctx.body = 'put';
    }
    async delete() {
        this.ctx.body = 'delete';
    }
    async options() {
        this.ctx.body = 'options';
    }
};
tslib_1.__decorate([
    egg_pig_1.Get('/get'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], HttpVerbController.prototype, "get", null);
tslib_1.__decorate([
    egg_pig_1.Post('/post'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], HttpVerbController.prototype, "post", null);
tslib_1.__decorate([
    egg_pig_1.Head('/head'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], HttpVerbController.prototype, "head", null);
tslib_1.__decorate([
    egg_pig_1.Patch('/patch'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], HttpVerbController.prototype, "patch", null);
tslib_1.__decorate([
    egg_pig_1.Put('/put'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], HttpVerbController.prototype, "put", null);
tslib_1.__decorate([
    egg_pig_1.Delete('/delete'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], HttpVerbController.prototype, "delete", null);
tslib_1.__decorate([
    egg_pig_1.Options('/options'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], HttpVerbController.prototype, "options", null);
HttpVerbController = tslib_1.__decorate([
    egg_pig_1.Controller('verb')
], HttpVerbController);
exports.default = HttpVerbController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cHZlcmIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJodHRwdmVyYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBdUM7QUFDdkMscUNBQW1GO0FBSW5GLElBQU0sa0JBQWtCLEdBQXhCLHdCQUF5QixTQUFRLHNCQUFnQjtJQUU3QyxLQUFLLENBQUMsR0FBRztRQUNMLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztJQUMxQixDQUFDO0lBRUQsS0FBSyxDQUFDLElBQUk7UUFDTixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7SUFDM0IsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFJO1FBQ04sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO0lBQzNCLENBQUM7SUFFRCxLQUFLLENBQUMsS0FBSztRQUNQLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztJQUM1QixDQUFDO0lBRUQsS0FBSyxDQUFDLEdBQUc7UUFDTCxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7SUFDMUIsQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFNO1FBQ1IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO0lBQzVCLENBQUM7SUFFRCxLQUFLLENBQUMsT0FBTztRQUNULElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztJQUM5QixDQUFDO0NBQ0osQ0FBQTtBQTNCRztJQURDLGFBQUcsQ0FBQyxNQUFNLENBQUM7Ozs7NkNBR1g7QUFFRDtJQURDLGNBQUksQ0FBQyxPQUFPLENBQUM7Ozs7OENBR2I7QUFFRDtJQURDLGNBQUksQ0FBQyxPQUFPLENBQUM7Ozs7OENBR2I7QUFFRDtJQURDLGVBQUssQ0FBQyxRQUFRLENBQUM7Ozs7K0NBR2Y7QUFFRDtJQURDLGFBQUcsQ0FBQyxNQUFNLENBQUM7Ozs7NkNBR1g7QUFFRDtJQURDLGdCQUFNLENBQUMsU0FBUyxDQUFDOzs7O2dEQUdqQjtBQUVEO0lBREMsaUJBQU8sQ0FBQyxVQUFVLENBQUM7Ozs7aURBR25CO0FBNUJDLGtCQUFrQjtJQUR2QixvQkFBVSxDQUFDLE1BQU0sQ0FBQztHQUNiLGtCQUFrQixDQTZCdkI7QUFHRCxrQkFBZSxrQkFBa0IsQ0FBQyJ9
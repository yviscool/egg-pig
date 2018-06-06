"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const egg_1 = require("egg");
const egg_pig_1 = require("../../../../../../");
let GlobalController = class GlobalController extends egg_1.BaseContextClass {
    async foo() {
        return 'ok';
    }
    async bar(id) {
        return id;
    }
    async xxx() {
        return 'ok';
    }
    async yyy() {
        throw new egg_pig_1.HttpException('exception', egg_pig_1.HttpStatus.BAD_REQUEST);
    }
};
tslib_1.__decorate([
    egg_pig_1.Get('guard'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], GlobalController.prototype, "foo", null);
tslib_1.__decorate([
    egg_pig_1.Get('pipe'),
    tslib_1.__param(0, egg_pig_1.Query('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], GlobalController.prototype, "bar", null);
tslib_1.__decorate([
    egg_pig_1.Get('interceptor'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], GlobalController.prototype, "xxx", null);
tslib_1.__decorate([
    egg_pig_1.Get('filter'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], GlobalController.prototype, "yyy", null);
GlobalController = tslib_1.__decorate([
    egg_pig_1.Controller('global')
], GlobalController);
exports.default = GlobalController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ2xvYmFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZCQUF1QztBQUN2QyxxQ0FBNEU7QUFHNUUsSUFBcUIsZ0JBQWdCLEdBQXJDLHNCQUFzQyxTQUFRLHNCQUFnQjtJQUcxRCxLQUFLLENBQUMsR0FBRztRQUNMLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFHRCxLQUFLLENBQUMsR0FBRyxDQUFjLEVBQUU7UUFDckIsT0FBTyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBR0QsS0FBSyxDQUFDLEdBQUc7UUFDTCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBR0QsS0FBSyxDQUFDLEdBQUc7UUFDTCxNQUFNLElBQUksdUJBQWEsQ0FBQyxXQUFXLEVBQUUsb0JBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNqRSxDQUFDO0NBQ0osQ0FBQTtBQWxCRztJQURDLGFBQUcsQ0FBQyxPQUFPLENBQUM7Ozs7MkNBR1o7QUFHRDtJQURDLGFBQUcsQ0FBQyxNQUFNLENBQUM7SUFDRCxtQkFBQSxlQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7Ozs7MkNBRXJCO0FBR0Q7SUFEQyxhQUFHLENBQUMsYUFBYSxDQUFDOzs7OzJDQUdsQjtBQUdEO0lBREMsYUFBRyxDQUFDLFFBQVEsQ0FBQzs7OzsyQ0FHYjtBQXBCZ0IsZ0JBQWdCO0lBRHBDLG9CQUFVLENBQUMsUUFBUSxDQUFDO0dBQ0EsZ0JBQWdCLENBcUJwQztrQkFyQm9CLGdCQUFnQiJ9
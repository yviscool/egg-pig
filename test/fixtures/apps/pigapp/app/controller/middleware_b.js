"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const egg_1 = require("egg");
const egg_pig_1 = require("../../../../../../");
let MiddlewareAController = class MiddlewareAController extends egg_1.BaseContextClass {
    async foo() {
        return 'foo';
    }
    async bar() {
        return 'bar';
    }
};
tslib_1.__decorate([
    egg_pig_1.Get('foo'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], MiddlewareAController.prototype, "foo", null);
tslib_1.__decorate([
    egg_pig_1.Get('bar'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], MiddlewareAController.prototype, "bar", null);
MiddlewareAController = tslib_1.__decorate([
    egg_pig_1.Controller('middleware_b')
], MiddlewareAController);
exports.default = MiddlewareAController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlkZGxld2FyZV9iLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWlkZGxld2FyZV9iLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZCQUF1QztBQUN2QyxxQ0FBMEM7QUFHMUMsSUFBcUIscUJBQXFCLEdBQTFDLDJCQUEyQyxTQUFRLHNCQUFnQjtJQUcvRCxLQUFLLENBQUMsR0FBRztRQUNMLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFHRCxLQUFLLENBQUMsR0FBRztRQUNMLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7Q0FHSixDQUFBO0FBVkc7SUFEQyxhQUFHLENBQUMsS0FBSyxDQUFDOzs7O2dEQUdWO0FBR0Q7SUFEQyxhQUFHLENBQUMsS0FBSyxDQUFDOzs7O2dEQUdWO0FBVmdCLHFCQUFxQjtJQUR6QyxvQkFBVSxDQUFDLGNBQWMsQ0FBQztHQUNOLHFCQUFxQixDQWF6QztrQkFib0IscUJBQXFCIn0=
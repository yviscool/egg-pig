"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const egg_1 = require("egg");
const egg_pig_1 = require("../../../../../../");
let HttpcodeController = class HttpcodeController extends egg_1.BaseContextClass {
    async foo() {
        return 'ok';
    }
    async bar() {
        return 'ok';
    }
};
tslib_1.__decorate([
    egg_pig_1.HttpCode(egg_pig_1.HttpStatus.NOT_FOUND),
    egg_pig_1.Get('get'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], HttpcodeController.prototype, "foo", null);
tslib_1.__decorate([
    egg_pig_1.HttpCode(egg_pig_1.HttpStatus.BAD_REQUEST),
    egg_pig_1.Post('post'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], HttpcodeController.prototype, "bar", null);
HttpcodeController = tslib_1.__decorate([
    egg_pig_1.Controller('httpcode')
], HttpcodeController);
exports.default = HttpcodeController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cGNvZGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJodHRwY29kZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBdUM7QUFDdkMscUNBQXFFO0FBR3JFLElBQXFCLGtCQUFrQixHQUF2Qyx3QkFBd0MsU0FBUSxzQkFBZ0I7SUFJNUQsS0FBSyxDQUFDLEdBQUc7UUFDTCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBSUQsS0FBSyxDQUFDLEdBQUc7UUFDTCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0NBQ0osQ0FBQTtBQVRHO0lBRkMsa0JBQVEsQ0FBQyxvQkFBVSxDQUFDLFNBQVMsQ0FBQztJQUM5QixhQUFHLENBQUMsS0FBSyxDQUFDOzs7OzZDQUdWO0FBSUQ7SUFGQyxrQkFBUSxDQUFDLG9CQUFVLENBQUMsV0FBVyxDQUFDO0lBQ2hDLGNBQUksQ0FBQyxNQUFNLENBQUM7Ozs7NkNBR1o7QUFaZ0Isa0JBQWtCO0lBRHRDLG9CQUFVLENBQUMsVUFBVSxDQUFDO0dBQ0Ysa0JBQWtCLENBYXRDO2tCQWJvQixrQkFBa0IifQ==
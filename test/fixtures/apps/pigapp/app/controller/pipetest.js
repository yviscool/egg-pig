"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const egg_1 = require("egg");
const egg_pig_1 = require("../../../../../../");
const class_validator_1 = require("class-validator");
class User {
    getName() {
        return this.firstName + ' ' + this.lastName;
    }
}
tslib_1.__decorate([
    class_validator_1.IsInt(),
    tslib_1.__metadata("design:type", Number)
], User.prototype, "age", void 0);
tslib_1.__decorate([
    class_validator_1.Length(2, 10),
    tslib_1.__metadata("design:type", String)
], User.prototype, "firstName", void 0);
tslib_1.__decorate([
    class_validator_1.IsString(),
    tslib_1.__metadata("design:type", String)
], User.prototype, "lastName", void 0);
let PipetestController = class PipetestController extends egg_1.BaseContextClass {
    async foo(id) {
        return id;
    }
    async bar(user) {
        return user.getName();
    }
    async xxx(id) {
        return id;
    }
};
tslib_1.__decorate([
    egg_pig_1.Get('parseint'),
    tslib_1.__param(0, egg_pig_1.Query('id', egg_pig_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PipetestController.prototype, "foo", null);
tslib_1.__decorate([
    egg_pig_1.Post('validation'),
    tslib_1.__param(0, egg_pig_1.Body(new egg_pig_1.ValidationPipe({ transform: true }))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [User]),
    tslib_1.__metadata("design:returntype", Promise)
], PipetestController.prototype, "bar", null);
tslib_1.__decorate([
    egg_pig_1.Get('other'),
    tslib_1.__param(0, egg_pig_1.Query('id', egg_pig_1.ValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PipetestController.prototype, "xxx", null);
PipetestController = tslib_1.__decorate([
    egg_pig_1.Controller('pipetest')
], PipetestController);
exports.default = PipetestController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZXRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwaXBldGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBdUM7QUFDdkMscUNBQTJGO0FBQzNGLHFEQUEwRDtBQUcxRDtJQVdJLE9BQU87UUFDSCxPQUFPLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDaEQsQ0FBQztDQUVKO0FBWkc7SUFEQyx1QkFBSyxFQUFFOztpQ0FDSTtBQUdaO0lBREMsd0JBQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDOzt1Q0FDSTtBQUdsQjtJQURDLDBCQUFRLEVBQUU7O3NDQUNNO0FBVXJCLElBQXFCLGtCQUFrQixHQUF2Qyx3QkFBd0MsU0FBUSxzQkFBZ0I7SUFHNUQsS0FBSyxDQUFDLEdBQUcsQ0FBNEIsRUFBRTtRQUNuQyxPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFHRCxLQUFLLENBQUMsR0FBRyxDQUFnRCxJQUFVO1FBQy9ELE9BQU8sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFHRCxLQUFLLENBQUMsR0FBRyxDQUE4QixFQUFFO1FBQ3JDLE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztDQUNKLENBQUE7QUFiRztJQURDLGFBQUcsQ0FBQyxVQUFVLENBQUM7SUFDTCxtQkFBQSxlQUFLLENBQUMsSUFBSSxFQUFFLHNCQUFZLENBQUMsQ0FBQTs7Ozs2Q0FFbkM7QUFHRDtJQURDLGNBQUksQ0FBQyxZQUFZLENBQUM7SUFDUixtQkFBQSxjQUFJLENBQUMsSUFBSSx3QkFBYyxDQUFDLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQTs7NkNBQU8sSUFBSTs7NkNBRWxFO0FBR0Q7SUFEQyxhQUFHLENBQUMsT0FBTyxDQUFDO0lBQ0YsbUJBQUEsZUFBSyxDQUFDLElBQUksRUFBRSx3QkFBYyxDQUFDLENBQUE7Ozs7NkNBRXJDO0FBZmdCLGtCQUFrQjtJQUR0QyxvQkFBVSxDQUFDLFVBQVUsQ0FBQztHQUNGLGtCQUFrQixDQWdCdEM7a0JBaEJvQixrQkFBa0IifQ==
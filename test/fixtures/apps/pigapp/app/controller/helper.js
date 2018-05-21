"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const egg_1 = require("egg");
const egg_pig_1 = require("../../../../../../");
const egg_pig_2 = require("../../../../../../");
const egg_pig_3 = require("../../../../../../");
let RoleGuard = class RoleGuard extends egg_pig_3.CanActivate {
    canActivate(context) {
        const handler = context.getHandler();
        const admin = this.ctx.helper['reflector'].get('Role', handler);
        return admin[0] === 'admin' ? true : false;
    }
};
RoleGuard = tslib_1.__decorate([
    egg_pig_3.Injectable()
], RoleGuard);
const Roles = (...args) => egg_pig_2.ReflectMetadata('Role', args);
let HelperController = class HelperController extends egg_1.BaseContextClass {
    async foo() {
        return 'admin';
    }
};
tslib_1.__decorate([
    egg_pig_1.Get(),
    Roles('admin'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], HelperController.prototype, "foo", null);
HelperController = tslib_1.__decorate([
    egg_pig_1.Controller('helper'),
    egg_pig_1.UseGuards(RoleGuard)
], HelperController);
exports.default = HelperController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZCQUF1QztBQUN2QyxxQ0FBcUQ7QUFFckQscUNBQTBDO0FBRTFDLHFDQUFvRTtBQUlwRSxJQUFNLFNBQVMsR0FBZixlQUFnQixTQUFRLHFCQUFXO0lBRS9CLFdBQVcsQ0FBQyxPQUF5QjtRQUNqQyxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDckMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNoRSxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQy9DLENBQUM7Q0FDSixDQUFBO0FBUEssU0FBUztJQURkLG9CQUFVLEVBQUU7R0FDUCxTQUFTLENBT2Q7QUFFRCxNQUFNLEtBQUssR0FBRyxDQUFDLEdBQUcsSUFBYyxFQUFFLEVBQUUsQ0FBQyx5QkFBZSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztBQUtuRSxJQUFxQixnQkFBZ0IsR0FBckMsc0JBQXNDLFNBQVEsc0JBQWdCO0lBSTFELEtBQUssQ0FBQyxHQUFHO1FBQ0wsT0FBTyxPQUFPLENBQUM7SUFDbkIsQ0FBQztDQUNKLENBQUE7QUFIRztJQUZDLGFBQUcsRUFBRTtJQUNMLEtBQUssQ0FBQyxPQUFPLENBQUM7Ozs7MkNBR2Q7QUFOZ0IsZ0JBQWdCO0lBRnBDLG9CQUFVLENBQUMsUUFBUSxDQUFDO0lBQ3BCLG1CQUFTLENBQUMsU0FBUyxDQUFDO0dBQ0EsZ0JBQWdCLENBT3BDO2tCQVBvQixnQkFBZ0IifQ==
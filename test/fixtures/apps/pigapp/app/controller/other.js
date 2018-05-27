"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const egg_1 = require("egg");
const egg_pig_1 = require("../../../../../../");
class TestGuard extends egg_pig_1.CanActivate {
    canActivate(context) {
        context;
        return Promise.resolve(true);
    }
}
let OtherController = class OtherController extends egg_1.BaseContextClass {
    async foo() {
        return '';
    }
    async body(id) {
        return id;
    }
    async query(id) {
        return id;
    }
    async head() {
        return 'head';
    }
};
tslib_1.__decorate([
    egg_pig_1.Get(),
    egg_pig_1.UseGuards(TestGuard),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], OtherController.prototype, "foo", null);
tslib_1.__decorate([
    egg_pig_1.Post('body'),
    tslib_1.__param(0, egg_pig_1.Body('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OtherController.prototype, "body", null);
tslib_1.__decorate([
    egg_pig_1.Get('query'),
    tslib_1.__param(0, egg_pig_1.Query('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OtherController.prototype, "query", null);
tslib_1.__decorate([
    egg_pig_1.Get('head'),
    egg_pig_1.Header('Cache-Control', 'no-cache'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], OtherController.prototype, "head", null);
OtherController = tslib_1.__decorate([
    egg_pig_1.Controller('other/')
], OtherController);
exports.default = OtherController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3RoZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJvdGhlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBdUM7QUFDdkMscUNBQTRGO0FBRTVGLGVBQWdCLFNBQVEscUJBQVc7SUFDL0IsV0FBVyxDQUFDLE9BQU87UUFDZixPQUFPLENBQUM7UUFDUixPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakMsQ0FBQztDQUNKO0FBR0QsSUFBcUIsZUFBZSxHQUFwQyxxQkFBcUMsU0FBUSxzQkFBZ0I7SUFJekQsS0FBSyxDQUFDLEdBQUc7UUFDTCxPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFHRCxLQUFLLENBQUMsSUFBSSxDQUFhLEVBQUU7UUFDckIsT0FBTyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBR0QsS0FBSyxDQUFDLEtBQUssQ0FBYyxFQUFFO1FBQ3ZCLE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUlELEtBQUssQ0FBQyxJQUFJO1FBQ04sT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztDQUNKLENBQUE7QUFuQkc7SUFGQyxhQUFHLEVBQUU7SUFDTCxtQkFBUyxDQUFDLFNBQVMsQ0FBQzs7OzswQ0FHcEI7QUFHRDtJQURDLGNBQUksQ0FBQyxNQUFNLENBQUM7SUFDRCxtQkFBQSxjQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7Ozs7MkNBRXJCO0FBR0Q7SUFEQyxhQUFHLENBQUMsT0FBTyxDQUFDO0lBQ0EsbUJBQUEsZUFBSyxDQUFDLElBQUksQ0FBQyxDQUFBOzs7OzRDQUV2QjtBQUlEO0lBRkMsYUFBRyxDQUFDLE1BQU0sQ0FBQztJQUNYLGdCQUFNLENBQUMsZUFBZSxFQUFFLFVBQVUsQ0FBQzs7OzsyQ0FHbkM7QUF0QmdCLGVBQWU7SUFEbkMsb0JBQVUsQ0FBQyxRQUFRLENBQUM7R0FDQSxlQUFlLENBdUJuQztrQkF2Qm9CLGVBQWUifQ==
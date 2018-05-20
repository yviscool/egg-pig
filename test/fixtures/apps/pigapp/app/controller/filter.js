"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const egg_1 = require("egg");
const egg_pig_1 = require("../../../../../../");
const egg_pig_2 = require("../../../../../../");
let AExceptionFilter = class AExceptionFilter extends egg_pig_2.ExceptionFilter {
    catch(exception) {
        this.ctx.status = egg_pig_1.HttpStatus.FORBIDDEN;
        this.ctx.body = {
            statusCode: exception.getStatus(),
            path: this.ctx.req.url
        };
    }
};
AExceptionFilter = tslib_1.__decorate([
    egg_pig_2.Catch(egg_pig_1.HttpException)
], AExceptionFilter);
class ForbiddenException extends egg_pig_1.HttpException {
    constructor() {
        super('Forbidden', egg_pig_1.HttpStatus.FORBIDDEN);
    }
}
let FilterController = class FilterController extends egg_1.BaseContextClass {
    async foo() {
        throw new egg_pig_1.HttpException({
            error: 'error',
        }, 500);
    }
    async bar() {
        throw new egg_pig_1.HttpException('Forbidden', egg_pig_1.HttpStatus.FORBIDDEN);
    }
    async foobar() {
        throw new egg_pig_1.HttpException({
            status: egg_pig_1.HttpStatus.FORBIDDEN,
            error: 'This is a custom message',
        }, 403);
    }
    async forbiden() {
        throw new ForbiddenException();
    }
};
tslib_1.__decorate([
    egg_pig_2.Get('common'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], FilterController.prototype, "foo", null);
tslib_1.__decorate([
    egg_pig_2.Get('httpexception'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], FilterController.prototype, "bar", null);
tslib_1.__decorate([
    egg_pig_2.Get('another'),
    egg_pig_2.UseFilters(AExceptionFilter),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], FilterController.prototype, "foobar", null);
tslib_1.__decorate([
    egg_pig_2.Get('forbiden'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], FilterController.prototype, "forbiden", null);
FilterController = tslib_1.__decorate([
    egg_pig_2.Controller('filter')
], FilterController);
exports.default = FilterController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmlsdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZCQUF1QztBQUV2QyxxQ0FBb0Q7QUFFcEQscUNBTWlCO0FBSWpCLElBQU0sZ0JBQWdCLEdBQXRCLHNCQUF1QixTQUFRLHlCQUFlO0lBQzFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsR0FBRztRQUNoQixHQUFHLENBQUMsTUFBTSxHQUFHLG9CQUFVLENBQUMsU0FBUyxDQUFDO1FBQ2xDLEdBQUcsQ0FBQyxJQUFJLEdBQUc7WUFDUCxVQUFVLEVBQUUsU0FBUyxDQUFDLFNBQVMsRUFBRTtZQUNqQyxTQUFTLEVBQUUsSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUU7WUFDbkMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRztTQUNwQixDQUFBO0lBQ0wsQ0FBQztDQUNKLENBQUE7QUFUSyxnQkFBZ0I7SUFEckIsZUFBSyxDQUFDLHVCQUFhLENBQUM7R0FDZixnQkFBZ0IsQ0FTckI7QUFFRCx3QkFBeUIsU0FBUSx1QkFBYTtJQUMxQztRQUNJLEtBQUssQ0FBQyxXQUFXLEVBQUUsb0JBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM3QyxDQUFDO0NBQ0o7QUFJRCxJQUFxQixnQkFBZ0IsR0FBckMsc0JBQXNDLFNBQVEsc0JBQWdCO0lBRzFELEtBQUssQ0FBQyxHQUFHO1FBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBSUQsS0FBSyxDQUFDLEdBQUc7UUFDTCxNQUFNLElBQUksdUJBQWEsQ0FBQyxXQUFXLEVBQUUsb0JBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBS0QsS0FBSyxDQUFDLE1BQU07UUFDUixNQUFNLElBQUksdUJBQWEsQ0FBQztZQUNwQixNQUFNLEVBQUUsb0JBQVUsQ0FBQyxTQUFTO1lBQzVCLEtBQUssRUFBRSwwQkFBMEI7U0FDcEMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNaLENBQUM7SUFHRCxLQUFLLENBQUMsUUFBUTtRQUNWLE1BQU0sSUFBSSxrQkFBa0IsRUFBRSxDQUFDO0lBQ25DLENBQUM7Q0FDSixDQUFBO0FBeEJHO0lBREMsYUFBRyxDQUFDLFFBQVEsQ0FBQzs7OzsyQ0FHYjtBQUlEO0lBREMsYUFBRyxDQUFDLGVBQWUsQ0FBQzs7OzsyQ0FHcEI7QUFLRDtJQUZDLGFBQUcsQ0FBQyxTQUFTLENBQUM7SUFDZCxvQkFBVSxDQUFDLGdCQUFnQixDQUFDOzs7OzhDQU01QjtBQUdEO0lBREMsYUFBRyxDQUFDLFVBQVUsQ0FBQzs7OztnREFHZjtBQTFCZ0IsZ0JBQWdCO0lBRHBDLG9CQUFVLENBQUMsUUFBUSxDQUFDO0dBQ0EsZ0JBQWdCLENBMkJwQztrQkEzQm9CLGdCQUFnQiJ9
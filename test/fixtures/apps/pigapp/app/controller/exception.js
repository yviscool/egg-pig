"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const egg_1 = require("egg");
const egg_pig_1 = require("../../../../../../");
let ExceptionController = class ExceptionController extends egg_1.BaseContextClass {
    async forbiden() {
        throw new egg_pig_1.ForbiddenException();
    }
    async bad() {
        throw new egg_pig_1.BadRequestException();
    }
    async unauthorized() {
        throw new egg_pig_1.UnauthorizedException();
    }
    async nofound() {
        throw new egg_pig_1.NotFoundException();
    }
    async notaccept() {
        throw new egg_pig_1.NotAcceptableException();
    }
    async timeout() {
        throw new egg_pig_1.RequestTimeoutException();
    }
    async conflict() {
        throw new egg_pig_1.ConflictException();
    }
    async playlod() {
        throw new egg_pig_1.GoneException();
    }
    async payload() {
        throw new egg_pig_1.PayloadTooLargeException();
    }
    async unsupport() {
        throw new egg_pig_1.UnsupportedMediaTypeException();
    }
    async unprocess() {
        throw new egg_pig_1.UnprocessableEntityException();
    }
    async internal() {
        throw new egg_pig_1.InternalServerErrorException();
    }
    async notimplement() {
        throw new egg_pig_1.NotImplementedException();
    }
    async badtateway() {
        throw new egg_pig_1.BadGatewayException();
    }
    async serviceun() {
        throw new egg_pig_1.ServiceUnavailableException();
    }
    async gatewaytimeout() {
        throw new egg_pig_1.GatewayTimeoutException();
    }
};
tslib_1.__decorate([
    egg_pig_1.Get('forbiden'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ExceptionController.prototype, "forbiden", null);
tslib_1.__decorate([
    egg_pig_1.Get('badrequest'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ExceptionController.prototype, "bad", null);
tslib_1.__decorate([
    egg_pig_1.Get('unauthorized'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ExceptionController.prototype, "unauthorized", null);
tslib_1.__decorate([
    egg_pig_1.Get('notfound'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ExceptionController.prototype, "nofound", null);
tslib_1.__decorate([
    egg_pig_1.Get('notacceptable'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ExceptionController.prototype, "notaccept", null);
tslib_1.__decorate([
    egg_pig_1.Get('timeout'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ExceptionController.prototype, "timeout", null);
tslib_1.__decorate([
    egg_pig_1.Get('conflict'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ExceptionController.prototype, "conflict", null);
tslib_1.__decorate([
    egg_pig_1.Get('gone'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ExceptionController.prototype, "playlod", null);
tslib_1.__decorate([
    egg_pig_1.Get('payload'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ExceptionController.prototype, "payload", null);
tslib_1.__decorate([
    egg_pig_1.Get('unsupport'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ExceptionController.prototype, "unsupport", null);
tslib_1.__decorate([
    egg_pig_1.Get('unprocess'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ExceptionController.prototype, "unprocess", null);
tslib_1.__decorate([
    egg_pig_1.Get('internal'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ExceptionController.prototype, "internal", null);
tslib_1.__decorate([
    egg_pig_1.Get('notimplement'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ExceptionController.prototype, "notimplement", null);
tslib_1.__decorate([
    egg_pig_1.Get('badgateway'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ExceptionController.prototype, "badtateway", null);
tslib_1.__decorate([
    egg_pig_1.Get('service'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ExceptionController.prototype, "serviceun", null);
tslib_1.__decorate([
    egg_pig_1.Get('gatewaytimeout'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ExceptionController.prototype, "gatewaytimeout", null);
ExceptionController = tslib_1.__decorate([
    egg_pig_1.Controller('exception')
], ExceptionController);
exports.default = ExceptionController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhjZXB0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZXhjZXB0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZCQUF1QztBQUN2QyxxQ0FBeWE7QUFHemEsSUFBcUIsbUJBQW1CLEdBQXhDLHlCQUF5QyxTQUFRLHNCQUFnQjtJQUc3RCxLQUFLLENBQUMsUUFBUTtRQUNWLE1BQU0sSUFBSSw0QkFBa0IsRUFBRSxDQUFBO0lBQ2xDLENBQUM7SUFHRCxLQUFLLENBQUMsR0FBRztRQUNMLE1BQU0sSUFBSSw2QkFBbUIsRUFBRSxDQUFBO0lBQ25DLENBQUM7SUFHRCxLQUFLLENBQUMsWUFBWTtRQUNkLE1BQU0sSUFBSSwrQkFBcUIsRUFBRSxDQUFBO0lBQ3JDLENBQUM7SUFHRCxLQUFLLENBQUMsT0FBTztRQUNULE1BQU0sSUFBSSwyQkFBaUIsRUFBRSxDQUFBO0lBQ2pDLENBQUM7SUFHRCxLQUFLLENBQUMsU0FBUztRQUNYLE1BQU0sSUFBSSxnQ0FBc0IsRUFBRSxDQUFBO0lBQ3RDLENBQUM7SUFHRCxLQUFLLENBQUMsT0FBTztRQUNULE1BQU0sSUFBSSxpQ0FBdUIsRUFBRSxDQUFBO0lBQ3ZDLENBQUM7SUFHRCxLQUFLLENBQUMsUUFBUTtRQUNWLE1BQU0sSUFBSSwyQkFBaUIsRUFBRSxDQUFDO0lBQ2xDLENBQUM7SUFHRCxLQUFLLENBQUMsT0FBTztRQUNULE1BQU0sSUFBSSx1QkFBYSxFQUFFLENBQUE7SUFDN0IsQ0FBQztJQUdELEtBQUssQ0FBQyxPQUFPO1FBQ1QsTUFBTSxJQUFJLGtDQUF3QixFQUFFLENBQUE7SUFDeEMsQ0FBQztJQUdELEtBQUssQ0FBQyxTQUFTO1FBQ1gsTUFBTSxJQUFJLHVDQUE2QixFQUFFLENBQUE7SUFDN0MsQ0FBQztJQUdELEtBQUssQ0FBQyxTQUFTO1FBQ1gsTUFBTSxJQUFJLHNDQUE0QixFQUFFLENBQUE7SUFDNUMsQ0FBQztJQUlELEtBQUssQ0FBQyxRQUFRO1FBQ1YsTUFBTSxJQUFJLHNDQUE0QixFQUFFLENBQUE7SUFDNUMsQ0FBQztJQUtELEtBQUssQ0FBQyxZQUFZO1FBQ2QsTUFBTSxJQUFJLGlDQUF1QixFQUFFLENBQUE7SUFDdkMsQ0FBQztJQUlELEtBQUssQ0FBQyxVQUFVO1FBQ1osTUFBTSxJQUFJLDZCQUFtQixFQUFFLENBQUE7SUFDbkMsQ0FBQztJQUdELEtBQUssQ0FBQyxTQUFTO1FBQ1gsTUFBTSxJQUFJLHFDQUEyQixFQUFFLENBQUE7SUFDM0MsQ0FBQztJQUlELEtBQUssQ0FBQyxjQUFjO1FBQ2hCLE1BQU0sSUFBSSxpQ0FBdUIsRUFBRSxDQUFBO0lBQ3ZDLENBQUM7Q0FHSixDQUFBO0FBckZHO0lBREMsYUFBRyxDQUFDLFVBQVUsQ0FBQzs7OzttREFHZjtBQUdEO0lBREMsYUFBRyxDQUFDLFlBQVksQ0FBQzs7Ozs4Q0FHakI7QUFHRDtJQURDLGFBQUcsQ0FBQyxjQUFjLENBQUM7Ozs7dURBR25CO0FBR0Q7SUFEQyxhQUFHLENBQUMsVUFBVSxDQUFDOzs7O2tEQUdmO0FBR0Q7SUFEQyxhQUFHLENBQUMsZUFBZSxDQUFDOzs7O29EQUdwQjtBQUdEO0lBREMsYUFBRyxDQUFDLFNBQVMsQ0FBQzs7OztrREFHZDtBQUdEO0lBREMsYUFBRyxDQUFDLFVBQVUsQ0FBQzs7OzttREFHZjtBQUdEO0lBREMsYUFBRyxDQUFDLE1BQU0sQ0FBQzs7OztrREFHWDtBQUdEO0lBREMsYUFBRyxDQUFDLFNBQVMsQ0FBQzs7OztrREFHZDtBQUdEO0lBREMsYUFBRyxDQUFDLFdBQVcsQ0FBQzs7OztvREFHaEI7QUFHRDtJQURDLGFBQUcsQ0FBQyxXQUFXLENBQUM7Ozs7b0RBR2hCO0FBSUQ7SUFEQyxhQUFHLENBQUMsVUFBVSxDQUFDOzs7O21EQUdmO0FBS0Q7SUFEQyxhQUFHLENBQUMsY0FBYyxDQUFDOzs7O3VEQUduQjtBQUlEO0lBREMsYUFBRyxDQUFDLFlBQVksQ0FBQzs7OztxREFHakI7QUFHRDtJQURDLGFBQUcsQ0FBQyxTQUFTLENBQUM7Ozs7b0RBR2Q7QUFJRDtJQURDLGFBQUcsQ0FBQyxnQkFBZ0IsQ0FBQzs7Ozt5REFHckI7QUFyRmdCLG1CQUFtQjtJQUR2QyxvQkFBVSxDQUFDLFdBQVcsQ0FBQztHQUNILG1CQUFtQixDQXdGdkM7a0JBeEZvQixtQkFBbUIifQ==
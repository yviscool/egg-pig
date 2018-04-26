"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const egg_1 = require("egg");
const egg_pig_1 = require("egg-pig");
let ContextController = class ContextController extends egg_1.BaseContextClass {
    async query(query) {
        this.ctx.body = query.id;
    }
    async param(param) {
        this.ctx.body = param;
    }
    async headers(headers) {
        this.ctx.body = headers.host.substring(0,3);
    }
    async request(req) {
        this.ctx.body = req.method;
    }
    async response(res) {
        res.body = 'ok';
    }
    async session(session) {
        this.ctx.body = session;
    }
    async context(ctx) {
        ctx.body = 'ok';
    }
    async body(body) {
        this.ctx.body = body;
    }
};
tslib_1.__decorate([
    egg_pig_1.Get('/query'),
    tslib_1.__param(0, egg_pig_1.Query()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ContextController.prototype, "query", null);
tslib_1.__decorate([
    egg_pig_1.Get('/param/:id'),
    tslib_1.__param(0, egg_pig_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ContextController.prototype, "param", null);
tslib_1.__decorate([
    egg_pig_1.Get('/headers'),
    tslib_1.__param(0, egg_pig_1.Headers()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ContextController.prototype, "headers", null);
tslib_1.__decorate([
    egg_pig_1.Get('/request'),
    tslib_1.__param(0, egg_pig_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ContextController.prototype, "request", null);
tslib_1.__decorate([
    egg_pig_1.Get('/response'),
    tslib_1.__param(0, egg_pig_1.Response()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ContextController.prototype, "response", null);
tslib_1.__decorate([
    egg_pig_1.Get('/session'),
    tslib_1.__param(0, egg_pig_1.Session()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ContextController.prototype, "session", null);
tslib_1.__decorate([
    egg_pig_1.Get('/context'),
    tslib_1.__param(0, egg_pig_1.Context()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ContextController.prototype, "context", null);
tslib_1.__decorate([
    egg_pig_1.Post('/body'),
    tslib_1.__param(0, egg_pig_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ContextController.prototype, "body", null);
ContextController = tslib_1.__decorate([
    egg_pig_1.Controller('context')
], ContextController);
exports.default = ContextController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbnRleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkJBQXVDO0FBQ3ZDLHFDQUFrSDtBQUtsSCxJQUFNLGlCQUFpQixHQUF2Qix1QkFBd0IsU0FBUSxzQkFBZ0I7SUFHNUMsS0FBSyxDQUFDLEtBQUssQ0FBVSxLQUFLO1FBQ3RCLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUdELEtBQUssQ0FBQyxLQUFLLENBQWMsS0FBSztRQUMxQixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7SUFDMUIsQ0FBQztJQUdELEtBQUssQ0FBQyxPQUFPLENBQVksT0FBTztRQUM1QixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO0lBQ2pDLENBQUM7SUFHRCxLQUFLLENBQUMsT0FBTyxDQUFZLEdBQUc7UUFDeEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO0lBQ3hCLENBQUM7SUFHRCxLQUFLLENBQUMsUUFBUSxDQUFhLEdBQUc7UUFDMUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO0lBQ3hCLENBQUM7SUFHRCxLQUFLLENBQUMsT0FBTyxDQUFZLE9BQU87UUFDNUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO0lBQzVCLENBQUM7SUFHRCxLQUFLLENBQUMsT0FBTyxDQUFZLEdBQUc7UUFDeEIsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDcEIsQ0FBQztJQUdELEtBQUssQ0FBQyxJQUFJLENBQVMsSUFBSTtRQUNuQixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDekIsQ0FBQztDQUNKLENBQUE7QUF0Q0c7SUFEQyxhQUFHLENBQUMsUUFBUSxDQUFDO0lBQ0QsbUJBQUEsZUFBSyxFQUFFLENBQUE7Ozs7OENBRW5CO0FBR0Q7SUFEQyxhQUFHLENBQUMsWUFBWSxDQUFDO0lBQ0wsbUJBQUEsZUFBSyxDQUFDLElBQUksQ0FBQyxDQUFBOzs7OzhDQUV2QjtBQUdEO0lBREMsYUFBRyxDQUFDLFVBQVUsQ0FBQztJQUNELG1CQUFBLGlCQUFPLEVBQUUsQ0FBQTs7OztnREFFdkI7QUFHRDtJQURDLGFBQUcsQ0FBQyxVQUFVLENBQUM7SUFDRCxtQkFBQSxpQkFBTyxFQUFFLENBQUE7Ozs7Z0RBRXZCO0FBR0Q7SUFEQyxhQUFHLENBQUMsV0FBVyxDQUFDO0lBQ0QsbUJBQUEsa0JBQVEsRUFBRSxDQUFBOzs7O2lEQUV6QjtBQUdEO0lBREMsYUFBRyxDQUFDLFVBQVUsQ0FBQztJQUNELG1CQUFBLGlCQUFPLEVBQUUsQ0FBQTs7OztnREFFdkI7QUFHRDtJQURDLGFBQUcsQ0FBQyxVQUFVLENBQUM7SUFDRCxtQkFBQSxpQkFBTyxFQUFFLENBQUE7Ozs7Z0RBRXZCO0FBR0Q7SUFEQyxjQUFJLENBQUMsT0FBTyxDQUFDO0lBQ0YsbUJBQUEsY0FBSSxFQUFFLENBQUE7Ozs7NkNBRWpCO0FBeENDLGlCQUFpQjtJQUR0QixvQkFBVSxDQUFDLFNBQVMsQ0FBQztHQUNoQixpQkFBaUIsQ0F5Q3RCO0FBR0Qsa0JBQWUsaUJBQWlCLENBQUMifQ==
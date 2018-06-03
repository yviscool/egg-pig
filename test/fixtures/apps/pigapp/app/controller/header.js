"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const egg_1 = require("egg");
const egg_pig_1 = require("../../../../../../");
let HeaderController = class HeaderController extends egg_1.BaseContextClass {
    async foo() {
        return 'ok';
    }
    async bar() {
        return 'ok';
    }
};
tslib_1.__decorate([
    egg_pig_1.Get('etag/'),
    egg_pig_1.Header('ETag', '123'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], HeaderController.prototype, "foo", null);
tslib_1.__decorate([
    egg_pig_1.Get('/other/'),
    egg_pig_1.Header({
        'Etag': '1234',
        'Last-Modified': '2018-9-1',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], HeaderController.prototype, "bar", null);
HeaderController = tslib_1.__decorate([
    egg_pig_1.Controller('/header/')
], HeaderController);
exports.default = HeaderController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaGVhZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZCQUF1QztBQUN2QyxxQ0FBaUQ7QUFHakQsSUFBcUIsZ0JBQWdCLEdBQXJDLHNCQUFzQyxTQUFRLHNCQUFnQjtJQUkxRCxLQUFLLENBQUMsR0FBRztRQUNMLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFPRCxLQUFLLENBQUMsR0FBRztRQUNMLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FDSixDQUFBO0FBWkc7SUFGQyxhQUFHLENBQUMsTUFBTSxDQUFDO0lBQ1gsZ0JBQU0sQ0FBQyxNQUFNLEVBQUMsS0FBSyxDQUFDOzs7OzJDQUdwQjtBQU9EO0lBTEMsYUFBRyxDQUFDLE9BQU8sQ0FBQztJQUNaLGdCQUFNLENBQUM7UUFDSixNQUFNLEVBQUUsTUFBTTtRQUNkLGVBQWUsRUFBRSxJQUFJLElBQUksRUFBRTtLQUM5QixDQUFDOzs7OzJDQUdEO0FBZmdCLGdCQUFnQjtJQURwQyxvQkFBVSxDQUFDLFFBQVEsQ0FBQztHQUNBLGdCQUFnQixDQWdCcEM7a0JBaEJvQixnQkFBZ0IifQ==
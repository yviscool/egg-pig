"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const egg_1 = require("egg");
const egg_pig_1 = require("../../../../../../");
const User = egg_pig_1.createParamDecorator((data, ctx) => {
    return ctx.url + '/' + data;
});
let AAPipe = class AAPipe extends egg_pig_1.PipeTransform {
    transform(val, metadata) {
        val && metadata;
        return val;
    }
};
AAPipe = tslib_1.__decorate([
    egg_pig_1.Pipe()
], AAPipe);
let UserController = class UserController extends egg_1.BaseContextClass {
    async index(user) {
        return user;
    }
};
tslib_1.__decorate([
    egg_pig_1.Get(),
    tslib_1.__param(0, User('test', AAPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "index", null);
UserController = tslib_1.__decorate([
    egg_pig_1.Controller('/user')
], UserController);
exports.default = UserController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmVuZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZCQUF1QztBQUN2QyxxQ0FBcUY7QUFFckYsTUFBTSxJQUFJLEdBQUcsOEJBQW9CLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUU7SUFDOUMsT0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFDL0IsQ0FBQyxDQUFDLENBQUM7QUFHSCxJQUFNLEtBQUssR0FBWCxXQUFZLFNBQVEsdUJBQWE7SUFDL0IsU0FBUyxDQUFDLEdBQUcsRUFBRSxRQUFRO1FBQ3JCLEdBQUcsSUFBSSxRQUFRLENBQUM7UUFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQixPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3RCLE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQztDQUNGLENBQUE7QUFQSyxLQUFLO0lBRFYsY0FBSSxFQUFFO0dBQ0QsS0FBSyxDQU9WO0FBSUQsSUFBcUIsY0FBYyxHQUFuQyxvQkFBb0MsU0FBUSxzQkFBZ0I7SUFHbkQsS0FBSyxDQUFDLEtBQUssQ0FBc0IsSUFBSTtRQUMxQyxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7Q0FHRixDQUFBO0FBTEM7SUFEQyxhQUFHLEVBQUU7SUFDYyxtQkFBQSxJQUFJLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFBOzs7OzJDQUV0QztBQUxrQixjQUFjO0lBRGxDLG9CQUFVLENBQUMsT0FBTyxDQUFDO0dBQ0MsY0FBYyxDQVFsQztrQkFSb0IsY0FBYyJ9
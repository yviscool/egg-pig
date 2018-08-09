"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const egg_1 = require("egg");
const egg_pig_1 = require("../../../../../../");
let MiddlewareRestController = class MiddlewareRestController extends egg_1.BaseContextClass {
    async index() {
        return 'index';
    }
    async update () {
        return 'update';
    }
};

MiddlewareRestController = tslib_1.__decorate([
    egg_pig_1.Resources('middleware_rest')
], MiddlewareRestController);
exports.default = MiddlewareRestController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlkZGxld2FyZV9hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWlkZGxld2FyZV9hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZCQUF1QztBQUN2QyxxQ0FBMEM7QUFHMUMsSUFBcUIscUJBQXFCLEdBQTFDLDJCQUEyQyxTQUFRLHNCQUFnQjtJQUcvRCxLQUFLLENBQUMsR0FBRztRQUNMLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFHRCxLQUFLLENBQUMsR0FBRztRQUNMLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7Q0FHSixDQUFBO0FBVkc7SUFEQyxhQUFHLENBQUMsS0FBSyxDQUFDOzs7O2dEQUdWO0FBR0Q7SUFEQyxhQUFHLENBQUMsS0FBSyxDQUFDOzs7O2dEQUdWO0FBVmdCLHFCQUFxQjtJQUR6QyxvQkFBVSxDQUFDLGNBQWMsQ0FBQztHQUNOLHFCQUFxQixDQWF6QztrQkFib0IscUJBQXFCIn0=
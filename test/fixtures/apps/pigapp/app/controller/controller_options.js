"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const egg_1 = require("egg");
const egg_pig_1 = require("../../../../../../");
let MiddlewareAController = class ControllerOptions extends egg_1.BaseContextClass {
    async foo() {
        return 'foo';
    }
    async bar() {
        return 'bar';
    }
};
tslib_1.__decorate([
    egg_pig_1.Get('foo', { middleware: ['logb'] }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], MiddlewareAController.prototype, "foo", null);
tslib_1.__decorate([
    egg_pig_1.Get('bar'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], MiddlewareAController.prototype, "bar", null);
MiddlewareAController = tslib_1.__decorate([
    egg_pig_1.Controller('controller_options', { middleware: ['loga'] })
], MiddlewareAController);
exports.default = MiddlewareAController;
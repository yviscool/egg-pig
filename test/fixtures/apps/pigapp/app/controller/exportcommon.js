"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const egg_1 = require("egg");
const egg_pig_1 = require("../../../../../../");
let PriorityAController = class PriorityAController {
    constructor(ctx, app, config, service) {
        this.ctx = ctx;
        this.app = app;
        this.config = config;
        this.service = service;
    }
    async foo() {
        return 'hello';
    }
};
__decorate([
    egg_pig_1.Get("/test"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PriorityAController.prototype, "foo", null);
PriorityAController = __decorate([
    egg_pig_1.Priority(1),
    egg_pig_1.Controller('exports'),
    __metadata("design:paramtypes", [Object, egg_1.Application, Object, Object])
], PriorityAController);
exports.PriorityAController = PriorityAController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpb3JpdHlBLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vYXBwL2NvbnRyb2xsZXIvcHJpb3JpdHlBLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsNkJBQW1FO0FBQ25FLHFDQUFvRDtBQUtwRCxJQUFhLG1CQUFtQixHQUFoQyxNQUFhLG1CQUFtQjtJQUU5QixZQUNVLEdBQVksRUFDWixHQUFnQixFQUNoQixNQUFvQixFQUNwQixPQUFpQjtRQUhqQixRQUFHLEdBQUgsR0FBRyxDQUFTO1FBQ1osUUFBRyxHQUFILEdBQUcsQ0FBYTtRQUNoQixXQUFNLEdBQU4sTUFBTSxDQUFjO1FBQ3BCLFlBQU8sR0FBUCxPQUFPLENBQVU7SUFDdkIsQ0FBQztJQUdMLEtBQUssQ0FBQyxHQUFHO1FBQ1AsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztDQUdGLENBQUE7QUFMQztJQURDLGFBQUcsQ0FBQyxPQUFPLENBQUM7Ozs7OENBR1o7QUFaVSxtQkFBbUI7SUFGL0Isa0JBQVEsQ0FBQyxDQUFDLENBQUM7SUFDWCxvQkFBVSxDQUFDLFFBQVEsQ0FBQzs2Q0FLSixpQkFBVztHQUpmLG1CQUFtQixDQWUvQjtBQWZZLGtEQUFtQiJ9
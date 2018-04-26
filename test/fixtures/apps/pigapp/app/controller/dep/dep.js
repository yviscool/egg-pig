"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const egg_1 = require("egg");
const egg_pig_1 = require("egg-pig");
let DepController = class DepController extends egg_1.BaseContextClass {
    async query(query) {
        this.ctx.body = query.id;
    }
};
tslib_1.__decorate([
    egg_pig_1.Get('/query'),
    tslib_1.__param(0, egg_pig_1.Query()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], DepController.prototype, "query", null);
DepController = tslib_1.__decorate([
    egg_pig_1.Controller('dep')
], DepController);
exports.default = DepController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGVwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZCQUF1QztBQUN2QyxxQ0FBZ0Q7QUFLaEQsSUFBTSxhQUFhLEdBQW5CLG1CQUFvQixTQUFRLHNCQUFnQjtJQUd4QyxLQUFLLENBQUMsS0FBSyxDQUFVLEtBQUs7UUFDdEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQztJQUM3QixDQUFDO0NBRUosQ0FBQTtBQUpHO0lBREMsYUFBRyxDQUFDLFFBQVEsQ0FBQztJQUNELG1CQUFBLGVBQUssRUFBRSxDQUFBOzs7OzBDQUVuQjtBQUxDLGFBQWE7SUFEbEIsb0JBQVUsQ0FBQyxLQUFLLENBQUM7R0FDWixhQUFhLENBT2xCO0FBR0Qsa0JBQWUsYUFBYSxDQUFDIn0=
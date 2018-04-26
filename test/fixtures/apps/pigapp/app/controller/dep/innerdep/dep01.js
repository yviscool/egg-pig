"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const egg_1 = require("egg");
const egg_pig_1 = require("egg-pig");
let InnerDepController = class InnerDepController extends egg_1.BaseContextClass {
    async query(query) {
        this.ctx.body = query;
    }
};
tslib_1.__decorate([
    egg_pig_1.Get('/query'),
    tslib_1.__param(0, egg_pig_1.Query()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], InnerDepController.prototype, "query", null);
InnerDepController = tslib_1.__decorate([
    egg_pig_1.Controller('innerdep')
], InnerDepController);
exports.default = InnerDepController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwMDEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkZXAwMS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBdUM7QUFDdkMscUNBQWdEO0FBS2hELElBQU0sa0JBQWtCLEdBQXhCLHdCQUF5QixTQUFRLHNCQUFnQjtJQUc3QyxLQUFLLENBQUMsS0FBSyxDQUFVLEtBQUs7UUFDdEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO0lBQzFCLENBQUM7Q0FFSixDQUFBO0FBSkc7SUFEQyxhQUFHLENBQUMsUUFBUSxDQUFDO0lBQ0QsbUJBQUEsZUFBSyxFQUFFLENBQUE7Ozs7K0NBRW5CO0FBTEMsa0JBQWtCO0lBRHZCLG9CQUFVLENBQUMsVUFBVSxDQUFDO0dBQ2pCLGtCQUFrQixDQU92QjtBQUdELGtCQUFlLGtCQUFrQixDQUFDIn0=
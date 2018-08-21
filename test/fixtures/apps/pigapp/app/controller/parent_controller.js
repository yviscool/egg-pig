"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const base_1 = require("../core/base");
const egg_pig_1 = require("../../../../../../");
let ParentController = class ParentController extends base_1.default {
    async foo() {
        return await this.other();
    }
};
tslib_1.__decorate([
    egg_pig_1.Get('test'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ParentController.prototype, "foo", null);
ParentController = tslib_1.__decorate([
    egg_pig_1.Controller('parent_controller')
], ParentController);
exports.default = ParentController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyZW50X2NvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwYXJlbnRfY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1Q0FBNEM7QUFDNUMscUNBQTBDO0FBRzFDLElBQXFCLGdCQUFnQixHQUFyQyxzQkFBc0MsU0FBUSxjQUFjO0lBR3hELEtBQUssQ0FBQyxHQUFHO1FBQ0wsT0FBTyxNQUFNLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUM5QixDQUFDO0NBRUosQ0FBQTtBQUpHO0lBREMsYUFBRyxDQUFDLE1BQU0sQ0FBQzs7OzsyQ0FHWDtBQUxnQixnQkFBZ0I7SUFEcEMsb0JBQVUsQ0FBQyxtQkFBbUIsQ0FBQztHQUNYLGdCQUFnQixDQU9wQztrQkFQb0IsZ0JBQWdCIn0=
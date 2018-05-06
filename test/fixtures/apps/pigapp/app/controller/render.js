"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const egg_1 = require("egg");
const egg_pig_1 = require("../../../../../../");
let APipes = class APipes extends egg_pig_1.PipeTransform {
    transform(val, metadata) {
        return 'zjl';
    }
};
APipes = tslib_1.__decorate([
    egg_pig_1.Pipe()
], APipes);
let HomeController = class HomeController extends egg_1.BaseContextClass {
    async index(query) {
        const dataList = {
            list: [
                { id: 1, title: 'this is news 1', url: '/news/1' },
                { id: 2, title: 'this is news 2', url: '/news/2' }
            ]
        };
        return dataList;
    }
    async home() {
        return this.app.router.url('renders', {});
    }
};
tslib_1.__decorate([
    egg_pig_1.Get(),
    egg_pig_1.Render('list.tpl'),
    tslib_1.__param(0, egg_pig_1.Query()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], HomeController.prototype, "index", null);
tslib_1.__decorate([
    egg_pig_1.Get('renders', '/home'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], HomeController.prototype, "home", null);
HomeController = tslib_1.__decorate([
    egg_pig_1.UsePipes(APipes),
    egg_pig_1.Controller('/render')
], HomeController);
exports.default = HomeController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImhvbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkJBQXVDO0FBQ3ZDLHFDQUF3RjtBQUl4RixJQUFNLE1BQU0sR0FBWixZQUFhLFNBQVEsdUJBQWE7SUFDaEMsU0FBUyxDQUFDLEdBQUcsRUFBRSxRQUFRO1FBQ3JCLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN0QixPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7Q0FDRixDQUFBO0FBTkssTUFBTTtJQURYLGNBQUksRUFBRTtHQUNELE1BQU0sQ0FNWDtBQU9ELElBQXFCLGNBQWMsR0FBbkMsb0JBQW9DLFNBQVEsc0JBQWdCO0lBSW5ELEtBQUssQ0FBQyxLQUFLLENBQVUsS0FBSztRQUMvQixLQUFLLElBQUksQ0FBQyxDQUFDO1FBQ1gsTUFBTSxRQUFRLEdBQUc7WUFDZixJQUFJLEVBQUU7Z0JBQ0osRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxnQkFBZ0IsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFO2dCQUNsRCxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUU7YUFDbkQ7U0FDRixDQUFDO1FBQ0YsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQztJQUdNLEtBQUssQ0FBQyxJQUFJO1FBQ2YsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzNDLENBQUM7Q0FFRixDQUFBO0FBaEJDO0lBRkMsYUFBRyxFQUFFO0lBQ0wsZ0JBQU0sQ0FBQyxVQUFVLENBQUM7SUFDQyxtQkFBQSxlQUFLLEVBQUUsQ0FBQTs7OzsyQ0FTMUI7QUFHRDtJQURDLGFBQUcsQ0FBQyxTQUFTLEVBQUMsT0FBTyxDQUFDOzs7OzBDQUd0QjtBQWxCa0IsY0FBYztJQUZsQyxrQkFBUSxDQUFDLE1BQU0sQ0FBQztJQUNoQixvQkFBVSxDQUFDLFNBQVMsQ0FBQztHQUNELGNBQWMsQ0FvQmxDO2tCQXBCb0IsY0FBYyJ9
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const class_transformer_1 = require("class-transformer");
const egg_1 = require("egg");
const egg_pig_1 = require("../../../../../../");
class RoleEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
}
class UserEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}
tslib_1.__decorate([
    class_transformer_1.Exclude(),
    tslib_1.__metadata("design:type", String)
], UserEntity.prototype, "password", void 0);
tslib_1.__decorate([
    class_transformer_1.Expose(),
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [])
], UserEntity.prototype, "fullName", null);
tslib_1.__decorate([
    class_transformer_1.Transform(role => role.name),
    tslib_1.__metadata("design:type", RoleEntity)
], UserEntity.prototype, "role", void 0);
let SerializerController = class SerializerController extends egg_1.BaseContextClass {
    async foo() {
        return [new UserEntity({
                id: 1,
                firstName: 'jay',
                lastName: 'chou',
                password: '123456',
                role: new RoleEntity({ id: 1, name: 'admin' })
            }), new UserEntity({
                id: 2,
                firstName: 'kamic',
                lastName: 'xxxla',
                password: '45678',
                role: new RoleEntity({ id: 2, name: 'user01' })
            })];
    }
};
tslib_1.__decorate([
    egg_pig_1.Get(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], SerializerController.prototype, "foo", null);
SerializerController = tslib_1.__decorate([
    egg_pig_1.Controller('serializer'),
    egg_pig_1.UseInterceptors(new egg_pig_1.ClassSerializerInterceptor())
], SerializerController);
exports.default = SerializerController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VyaWFsaXplci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNlcmlhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkJBQXVDO0FBQ3ZDLHlEQUErRDtBQUMvRCxxQ0FBOEY7QUFHOUY7SUFJSSxZQUFZLE9BQTRCO1FBQ3BDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2pDLENBQUM7Q0FDSjtBQUVEO0lBZUksWUFBWSxPQUE0QjtRQUNwQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBUkQsSUFBSSxRQUFRO1FBQ1IsT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFBO0lBQy9DLENBQUM7Q0FPSjtBQVpHO0lBREMsMkJBQU8sRUFBRTs7NENBQ087QUFHakI7SUFEQywwQkFBTSxFQUFFOzs7MENBR1I7QUFFRDtJQURDLDZCQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO3NDQUN2QixVQUFVO3dDQUFBO0FBV3BCLElBQXFCLG9CQUFvQixHQUF6QywwQkFBMEMsU0FBUSxzQkFBZ0I7SUFHOUQsS0FBSyxDQUFDLEdBQUc7UUFDTCxPQUFPLENBQUMsSUFBSSxVQUFVLENBQUM7Z0JBQ25CLEVBQUUsRUFBRSxDQUFDO2dCQUNMLFNBQVMsRUFBRSxLQUFLO2dCQUNoQixRQUFRLEVBQUUsTUFBTTtnQkFDaEIsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLElBQUksRUFBRSxJQUFJLFVBQVUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDO2FBQ2pELENBQUMsRUFBRSxJQUFJLFVBQVUsQ0FBQztnQkFDZixFQUFFLEVBQUUsQ0FBQztnQkFDTCxTQUFTLEVBQUUsT0FBTztnQkFDbEIsUUFBUSxFQUFFLE9BQU87Z0JBQ2pCLFFBQVEsRUFBRSxPQUFPO2dCQUNqQixJQUFJLEVBQUUsSUFBSSxVQUFVLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQzthQUNsRCxDQUFDLENBQUMsQ0FBQTtJQUNQLENBQUM7Q0FDSixDQUFBO0FBZkc7SUFEQyxhQUFHLEVBQUU7Ozs7K0NBZUw7QUFqQmdCLG9CQUFvQjtJQUZ4QyxvQkFBVSxDQUFDLFlBQVksQ0FBQztJQUN4Qix5QkFBZSxDQUFDLElBQUksb0NBQTBCLEVBQUUsQ0FBQztHQUM3QixvQkFBb0IsQ0FrQnhDO2tCQWxCb0Isb0JBQW9CIn0=
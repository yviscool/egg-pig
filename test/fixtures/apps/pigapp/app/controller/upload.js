"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const egg_1 = require("egg");
const egg_pig_1 = require("../../../../../../");
const pump = require('mz-modules/pump');
const fs = require("fs");
const path = require("path");
let UploadController = class UploadController extends egg_1.BaseContextClass {
    async index(stream) {
        const filename = encodeURIComponent(stream.fields.name) + path.extname(stream.filename).toLowerCase();
        const target = path.join(this.config.baseDir, 'app/public', filename);
        const writeStream = fs.createWriteStream(target);
        await pump(stream, writeStream);
        return 'ok';
    }
    async multiple(parts) {
        let stream;
        while ((stream = await parts()) != null) {
            const filename = stream.filename.toLowerCase();
            const target = path.join(this.config.baseDir, 'app/public', filename);
            const writeStream = fs.createWriteStream(target);
            await pump(stream, writeStream);
        }
        return 'ok';
    }
    async fileMethod(file) {
        const filename = encodeURIComponent(this.ctx.request.body.name) + path.extname(file.filename).toLowerCase();
        const targetPath = path.join(this.config.baseDir, 'app/public', filename);
        const source = fs.createReadStream(file.filepath);
        const target = fs.createWriteStream(targetPath);
        await pump(source, target);
        return 'ok';
    }
    async filesMethod(files) {
        for (const file of files) {
            const filename = file.filename.toLowerCase();
            const targetPath = path.join(this.config.baseDir, 'app/public', filename);
            const source = fs.createReadStream(file.filepath);
            const target = fs.createWriteStream(targetPath);
            await pump(source, target);
        }
        return 'ok';
    }
};
tslib_1.__decorate([
    egg_pig_1.Post('form'),
    tslib_1.__param(0, egg_pig_1.UploadedFileStream()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UploadController.prototype, "index", null);
tslib_1.__decorate([
    egg_pig_1.Post('multiple'),
    tslib_1.__param(0, egg_pig_1.UploadedFilesStream({ autoFields: true })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UploadController.prototype, "multiple", null);
tslib_1.__decorate([
    egg_pig_1.Post('file'),
    tslib_1.__param(0, egg_pig_1.UploadedFile()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UploadController.prototype, "fileMethod", null);
tslib_1.__decorate([
    egg_pig_1.Post('files'),
    tslib_1.__param(0, egg_pig_1.UploadedFiles()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UploadController.prototype, "filesMethod", null);
UploadController = tslib_1.__decorate([
    egg_pig_1.Controller('upload')
], UploadController);
exports.default = UploadController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbnRleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkJBQXVDO0FBQ3ZDLHFDQUF3RTtBQUN4RSx1REFBd0Q7QUFDeEQsa0RBQW1EO0FBQ25ELHlCQUF5QjtBQUN6Qiw2QkFBNkI7QUFHN0IsSUFBcUIsZ0JBQWdCLEdBQXJDLHNCQUFzQyxTQUFRLHNCQUFnQjtJQUc1RCxLQUFLLENBQUMsS0FBSyxDQUFpQixNQUFNO1FBQ2hDLE1BQU0sUUFBUSxHQUFHLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDdEcsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDdEUsTUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2pELElBQUk7WUFDRixNQUFNLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7U0FDeEQ7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLE1BQU0sY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzdCLE1BQU0sR0FBRyxDQUFDO1NBQ1g7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFJRCxLQUFLLENBQUMsUUFBUSxDQUFzQyxLQUFLO1FBQ3ZELE1BQU0sS0FBSyxHQUFVLEVBQUUsQ0FBQztRQUV4QixJQUFJLE1BQU0sQ0FBQztRQUNYLE9BQU8sQ0FBQyxNQUFNLEdBQUcsTUFBTSxLQUFLLEVBQUUsQ0FBQyxJQUFJLElBQUksRUFBRTtZQUN2QyxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQy9DLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3RFLE1BQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNqRCxJQUFJO2dCQUNGLE1BQU0sZ0JBQWdCLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQzthQUN4RDtZQUFDLE9BQU8sR0FBRyxFQUFFO2dCQUNaLE1BQU0sY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUM3QixNQUFNLEdBQUcsQ0FBQzthQUNYO1lBQ0QsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUN0QjtRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztDQUNGLENBQUE7QUFsQ0M7SUFEQyxjQUFJLENBQUMsTUFBTSxDQUFDO0lBQ0EsbUJBQUEsc0JBQVksRUFBRSxDQUFBOzs7OzZDQVcxQjtBQUlEO0lBREMsY0FBSSxDQUFDLFVBQVUsQ0FBQztJQUNELG1CQUFBLHVCQUFhLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTs7OztnREFrQmxEO0FBcENrQixnQkFBZ0I7SUFEcEMsb0JBQVUsQ0FBQyxRQUFRLENBQUM7R0FDQSxnQkFBZ0IsQ0FxQ3BDO2tCQXJDb0IsZ0JBQWdCIn0=
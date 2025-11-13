"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreinosModule = void 0;
const common_1 = require("@nestjs/common");
const treinos_service_1 = require("./treinos.service");
const treinos_controller_1 = require("./treinos.controller");
let TreinosModule = class TreinosModule {
};
exports.TreinosModule = TreinosModule;
exports.TreinosModule = TreinosModule = __decorate([
    (0, common_1.Module)({
        controllers: [treinos_controller_1.TreinosController],
        providers: [treinos_service_1.TreinosService],
        exports: [treinos_service_1.TreinosService],
    })
], TreinosModule);
//# sourceMappingURL=treinos.module.js.map
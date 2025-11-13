"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateExercicioDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_exercicio_dto_1 = require("./create-exercicio.dto");
class UpdateExercicioDto extends (0, swagger_1.PartialType)(create_exercicio_dto_1.CreateExercicioDto) {
}
exports.UpdateExercicioDto = UpdateExercicioDto;
//# sourceMappingURL=update-exercicio.dto.js.map
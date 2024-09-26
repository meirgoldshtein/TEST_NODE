"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Beeper_1 = __importDefault(require("../models/Beeper"));
const fileDAL_1 = require("../config/fileDAL");
class PostService {
    static createBeeper(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = post;
            const newBeeper = new Beeper_1.default(name);
            const data = yield (0, fileDAL_1.getFileData)('beepers');
            if (!data) {
                const res = yield (0, fileDAL_1.writeFileData)('beepers', [newBeeper]);
                return res ? newBeeper._id : res;
            }
            data.push(newBeeper);
            const res = yield (0, fileDAL_1.writeFileData)('beepers', data);
            return res ? newBeeper._id : res;
        });
    }
    static getAllBeepers() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, fileDAL_1.getFileData)('beepers');
            return data ? data : false;
        });
    }
    static searchById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, fileDAL_1.getFileData)('beepers');
            if (!data) {
                return false;
            }
            const beeper = data.find((beeper) => beeper._id === id);
            return beeper ? beeper : false;
        });
    }
    static searchByStatus(status) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, fileDAL_1.getFileData)('beepers');
            if (!data) {
                return false;
            }
            const beeper = data.filter((beeper) => beeper.status === status);
            return beeper ? beeper : false;
        });
    }
}
exports.default = PostService;

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
exports.writeFileSync = exports.writeFileData = exports.getFileData = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const getFileData = (resource) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield promises_1.default.readFile(`${__dirname}/../../data/${resource}.json`, 'utf8');
        const JSONdata = JSON.parse(data);
        return JSONdata ? JSONdata : [];
    }
    catch (err) {
        console.log(err);
    }
});
exports.getFileData = getFileData;
const writeFileData = (resource, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stringData = JSON.stringify(data, null, 2);
        yield promises_1.default.writeFile(`${__dirname}/../../data/${resource}.json`, stringData, { encoding: 'utf8' });
        console.log('Data saved to file');
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
});
exports.writeFileData = writeFileData;
const writeFileSync = (resource, data) => {
    try {
        const stringData = JSON.stringify(data, null, 2);
        promises_1.default.writeFile(`${__dirname}/../../data/${resource}.json`, stringData, { encoding: 'utf8' });
        console.log('Data saved to file');
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
};
exports.writeFileSync = writeFileSync;

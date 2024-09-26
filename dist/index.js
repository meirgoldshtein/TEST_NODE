"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const beeperController_1 = __importDefault(require("./controllers/beeperController"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/beepers', beeperController_1.default);
app.listen(process.env.PORT, () => console.log(`Example app listening at http://localhost:${process.env.PORT}`));

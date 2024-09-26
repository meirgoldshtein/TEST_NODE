"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const beeperStatus_1 = __importDefault(require("../enams/beeperStatus"));
class Beeper {
    constructor(_name) {
        this.created_at = new Date();
        this.status = beeperStatus_1.default.manufactured;
        this._id = (0, uuid_1.v4)();
        this.name = _name;
        this.exploded_at = null;
        this.latitude = null;
        this.longitude = null;
    }
}
exports.default = Beeper;

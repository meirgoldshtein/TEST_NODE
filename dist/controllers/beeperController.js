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
const express_1 = __importDefault(require("express"));
const beeperService_1 = __importDefault(require("../services/beeperService"));
const router = express_1.default.Router();
// קבלת ביפרים לפי סטטוס
router.get('/status/:status', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield beeperService_1.default.searchByStatus(req.params.status);
        if (result) {
            console.log(req.params.filterString);
            res.status(200).json(result);
        }
        else
            throw new Error('can not find');
    }
    catch (err) {
        res.status(500).json({
            err: true,
            message: err,
            data: null
        });
    }
}));
// קבלת ביפרים לפי מזהה
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const beeper = yield beeperService_1.default.searchById(req.params.id);
        if (beeper) {
            res.status(200).json(beeper);
        }
    }
    catch (err) {
        res.status(400).json({
            err: true,
            message: err,
            data: null
        });
    }
}));
// קבלת כל הביפרים
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield beeperService_1.default.getAllBeepers();
        if (result) {
            console.log(req.params.filterString);
            res.status(200).json(result);
        }
        else
            throw new Error('can not add new post');
    }
    catch (err) {
        res.status(500).json({
            err: true,
            message: err,
            data: null
        });
    }
}));
// רישום ביפר חדש
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("fgdhdfhdfh");
        const result = yield beeperService_1.default.createBeeper(req.body);
        if (result) {
            res.status(200).json(result);
        }
        else
            throw new Error('can not add new beeper');
    }
    catch (err) {
        res.status(500).json({
            err: true,
            message: err,
            data: null
        });
    }
}));
router.put('/:id/status', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const locationObj = req.body;
        const result = yield beeperService_1.default.updateStatus(req.params.id, locationObj);
        if (result) {
            res.status(200).json(result);
        }
        else
            throw new Error('can not updated');
    }
    catch (err) {
        console.log(err);
        res.status(400).json({
            err: true,
            message: err.message,
            data: null
        });
    }
}));
router.patch('/:id/status', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const locationObj = req.body;
        const updateLocation2 = yield beeperService_1.default.updateStatus2(req.params.id, locationObj);
        if (updateLocation2) {
            res.status(200).json(updateLocation2);
        }
        else
            throw new Error('can not updated');
    }
    catch (err) {
        console.log(err);
        res.status(400).json({
            err: true,
            message: err.message,
            data: null
        });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield beeperService_1.default.deleteBeeper(req.params.id);
        if (result) {
            res.status(200).json({
                err: false,
                message: 'delete ok',
                data: undefined
            });
        }
        else
            throw new Error('can not delete beeper');
    }
    catch (err) {
        res.status(400).json({
            err: true,
            message: err,
            data: null
        });
    }
}));
exports.default = router;

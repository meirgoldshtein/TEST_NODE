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
            res.status(200).json({
                err: false,
                message: 'success search',
                data: result
            });
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
            res.status(200).json({
                err: false,
                message: 'success to get beeper',
                data: beeper
            });
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
            res.status(200).json({
                err: false,
                message: 'success search',
                data: result
            });
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
        const result = yield beeperService_1.default.createBeeper(req.body);
        if (result) {
            res.status(200).json({
                err: false,
                message: 'new beeper added',
                data: { beeper_id: result }
            });
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
// router.put('/:id/status',async (req : Request<any,any,any, {status: string}>, res : Response):Promise<void> => {
//     try {
//         const{post_id, user_id} = req.query
//         if (!post_id || !user_id) {
//             throw new Error('post_id and user_id are required');
//         }
//         const registerInPost = await PostService.addLikeToPost(post_id, user_id);
//         const registerInUser = await PostService.registerLikeInUser(post_id, user_id);
//         if (registerInPost && registerInUser){
//             res.status(200).json({
//                 err: false,
//                 message: 'new like added',
//                 data: null
//             });
//         }
//         else throw new Error('can not add new like');
//     }
//     catch(err: any) {
//         console.log(err)
//         res.status(400).json({
//             err: true,
//             message: err.message,
//             data: null
//         });
//     }
// })
// router.delete('/:id',async (req : Request, res : exp.Response):Promise<void> => {
//     try {
//         const result = await PostService.deletePost(req.params.id);
//         if (result){
//             res.status(200).json({
//                 err: false,
//                 message: 'delete ok',
//                 data: undefined
//             });
//         }
//         else throw new Error('can not delete post');        
//     }
//     catch(err) {
//         res.status(400).json({
//             err: true,
//             message: err,
//             data: null
//         });
//     }
// })
exports.default = router;

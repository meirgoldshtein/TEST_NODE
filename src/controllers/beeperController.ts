 
import exp, {Router, Request, Response} from 'express';
import Beeper from '../models/Beeper';
import NewBeeperDTO from '../interfaces/NewBeeperDTO';
import beeperService from '../services/beeperService';

const router : Router = exp.Router();

// קבלת ביפרים לפי סטטוס
router.get('/status/:status',async (req : Request, res : Response):Promise<void> => {
    try {
        const result : boolean | Beeper[] = await beeperService.searchByStatus(req.params.status);
        if (result){
            console.log(req.params.filterString)
            res.status(200).json({
                err: false,
                message: 'success search', 
                data: result
            });
        }
        else throw new Error('can not find');      
    }
    catch(err) {
        res.status(500).json({
            err: true,
            message: err,
            data: null
        });
    }
})


// קבלת ביפרים לפי מזהה
router.get('/:id',async (req : Request, res : Response):Promise<void> => {
    try {
        const beeper : boolean | Beeper = await beeperService.searchById(req.params.id);
        if (beeper){
            res.status(200).json({
                err: false,
                message: 'success to get beeper',
                data: beeper
            });
        }
      
    }
    catch(err) {
        res.status(400).json({
            err: true,
            message: err,
            data: null
        });
    }
})

// קבלת כל הביפרים
router.get('/',async (req : Request, res : Response):Promise<void> => {
    try {
        const result : boolean | Beeper[] = await beeperService.getAllBeepers();
        if (result){
            console.log(req.params.filterString)
            res.status(200).json({
                err: false,
                message: 'success search', 
                data: result
            });
        }
        else throw new Error('can not add new post');      
    }
    catch(err) {
        res.status(500).json({
            err: true,
            message: err,
            data: null
        });
    }
})

// רישום ביפר חדש
router.post('/',async (req : Request<any, any, NewBeeperDTO>, res : exp.Response):Promise<void> => {
    try {
        const result = await beeperService.createBeeper(req.body);
        if (result){
            res.status(200).json({
                err: false,
                message: 'new beeper added',
                data: {beeper_id: result}
            });
        }
        else throw new Error('can not add new beeper');   
        
    }
    catch(err) {
        res.status(500).json({
            err: true,
            message: err,
            data: null
        });
    }
})


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



export default router
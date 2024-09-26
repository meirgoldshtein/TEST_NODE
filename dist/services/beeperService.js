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
const beeperStatus_1 = __importDefault(require("../enums/beeperStatus"));
class PostService {
    // יצירת ביפר חדש
    static createBeeper(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = post;
            const newBeeper = new Beeper_1.default(name);
            const data = yield (0, fileDAL_1.getFileData)('beepers');
            if (!data) {
                const res = yield (0, fileDAL_1.writeFileData)('beepers', [newBeeper]);
                return res ? newBeeper : res;
            }
            data.push(newBeeper);
            const res = yield (0, fileDAL_1.writeFileData)('beepers', data);
            return res ? newBeeper : res;
        });
    }
    // קבלת כל הביפרים
    static getAllBeepers() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, fileDAL_1.getFileData)('beepers');
            return data ? data : false;
        });
    }
    // קבלת ביפר ספציפי
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
    // קבלת ביפרים לפי מצב
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
    // מחיקת ביפר
    static deleteBeeper(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, fileDAL_1.getFileData)('beepers');
            if (!data) {
                return false;
            }
            const index = data.findIndex((beeper) => beeper._id === id);
            if (index === -1) {
                return false;
            }
            data.splice(index, 1);
            const res = yield (0, fileDAL_1.writeFileData)('beepers', data);
            return res;
        });
    }
    // טיפול במצב טרום פיצוץ ועדכון הפיצוץ לאחר 10 שניות 
    static startBombing(data, index, location) {
        return __awaiter(this, void 0, void 0, function* () {
            data[index].latitude = location.LAT;
            data[index].longitude = location.LON;
            data[index].status = beeperStatus_1.default.deployed;
            yield (0, fileDAL_1.writeFileData)('beepers', data);
            console.log("10 seconds to boom");
            return new Promise((resolve) => {
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    console.log("booooom");
                    data[index].status = beeperStatus_1.default.detonated;
                    data[index].exploded_at = new Date();
                    const res = yield (0, fileDAL_1.writeFileData)('beepers', data);
                    resolve(res);
                }), 10000);
            });
        });
    }
    // בדיקת תקינות נתום המיקום
    static validationsLocation(location) {
        if (!location.LAT.toString() || !location.LON.toString()) {
            return false;
        }
        return true;
    }
    // בדיקת תקינות נתון הסטטוס
    static validationsStatus(status) {
        if (status !== beeperStatus_1.default.manufactured && status !== beeperStatus_1.default.assembled && status !== beeperStatus_1.default.shipped && status !== beeperStatus_1.default.deployed) {
            return false;
        }
        return true;
    }
    //בדיקת תקינות הסטטוס החדש ביחס לסטטוס הישן
    static validatNewStatus(newStatus, current_status) {
        switch (newStatus) {
            case beeperStatus_1.default.assembled:
                return (current_status == beeperStatus_1.default.manufactured);
            case beeperStatus_1.default.shipped:
                return (current_status == beeperStatus_1.default.assembled);
            case beeperStatus_1.default.deployed:
                return (current_status == beeperStatus_1.default.shipped);
            default:
                return false;
        }
    }
    //יצירת סטטוס החדש ביחס לסטטוס הישן
    static getNextStatus(status) {
        switch (status) {
            case beeperStatus_1.default.manufactured:
                return beeperStatus_1.default.assembled;
            case beeperStatus_1.default.assembled:
                return beeperStatus_1.default.shipped;
            case beeperStatus_1.default.shipped:
                return beeperStatus_1.default.deployed;
            default:
                return beeperStatus_1.default.manufactured;
        }
    }
    // פונקצייה ראשית לטיפול בעדכון סטטוס בהתאם למצב הקודם
    static updateStatus(id, location) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("ggggggggggggg");
            if (!this.validationsLocation(location))
                return false;
            const data = yield (0, fileDAL_1.getFileData)('beepers');
            if (!data)
                return false;
            const index = data.findIndex((beeper) => beeper._id === id);
            if (index === -1)
                return false;
            const prev_status = data[index].status;
            const new_status = this.getNextStatus(prev_status);
            console.log(prev_status);
            console.log(new_status);
            data[index].status = new_status;
            if (new_status == beeperStatus_1.default.deployed) {
                const bombingResult = yield this.startBombing(data, index, location);
                console.log("Bombing completed", bombingResult);
                return true;
            }
            const res = yield (0, fileDAL_1.writeFileData)('beepers', data);
            return data[index];
        });
    }
    // בדיקת תקינות כתיבת הסטטוס
    static validationsLocation2(location) {
        if (location.status !== beeperStatus_1.default.manufactured && location.status !== beeperStatus_1.default.assembled && location.status !== beeperStatus_1.default.shipped && location.status !== beeperStatus_1.default.deployed) {
            return false;
        }
        return true;
    }
    // פונקצייה ראשית לטיפול בעדכון סטטוס עם סטטוס מפורש שצויין מהלקוח
    static updateStatus2(id, statusObj) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield (0, fileDAL_1.getFileData)('beepers');
                if (!data)
                    return false;
                const index = data.findIndex((beeper) => beeper._id === id);
                if (index === -1)
                    return false;
                if (!this.validationsLocation2(statusObj))
                    return false;
                let current_status = data[index].status;
                const new_status = statusObj.status;
                if (!this.validatNewStatus(new_status, current_status))
                    return false;
                data[index].status = new_status;
                if (new_status == beeperStatus_1.default.deployed) {
                    data[index].latitude = statusObj.lat;
                    data[index].longitude = statusObj.lon;
                    data[index].status = new_status;
                    yield (0, fileDAL_1.writeFileData)('beepers', data);
                    yield setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        console.log("booooom");
                        data[index].status = beeperStatus_1.default.detonated;
                        data[index].exploded_at = new Date();
                        const res = yield (0, fileDAL_1.writeFileData)('beepers', data);
                        return res;
                    }), 10000);
                    return data[index];
                }
                const res = yield (0, fileDAL_1.writeFileData)('beepers', data);
                return res ? data[index] : res;
            }
            catch (err) {
                console.log(err);
                return false;
            }
        });
    }
}
exports.default = PostService;

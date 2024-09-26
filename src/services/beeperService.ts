import Beeper from "../models/Beeper";
import NewBeeperDTO from "../interfaces/NewBeeperDTO";
import { getFileData, writeFileData, writeFileSync } from '../config/fileDAL';
import beeperStatus from "../enums/beeperStatus";
import locationDTO from "../interfaces/locationDTO";
import location2DTO from "../interfaces/location2DTO";
export default class PostService {

    // יצירת ביפר חדש
    public static async createBeeper(post: NewBeeperDTO): Promise<boolean | Beeper> {

        const { name } = post;
        const newBeeper: Beeper = new Beeper(name);
        const data = await getFileData<Beeper>('beepers');
        if (!data) {
            const res = await writeFileData<Beeper>('beepers', [newBeeper]);
            return res ? newBeeper : res;
        }
        data.push(newBeeper);
        const res = await writeFileData<Beeper>('beepers', data);
        return res ? newBeeper : res;
    }

    // קבלת כל הביפרים
    public static async getAllBeepers(): Promise<boolean | Beeper[]> {
        const data = await getFileData<Beeper>('beepers');
        return data ? data : false;
    }

    // קבלת ביפר ספציפי
    public static async searchById(id: string): Promise<boolean | Beeper> {
        const data = await getFileData<Beeper>('beepers');
        if (!data) {
            return false;
        }
        const beeper = data.find((beeper) => beeper._id === id);
        return beeper ? beeper : false;

    }

    // קבלת ביפרים לפי מצב
    public static async searchByStatus(status: string): Promise<boolean | Beeper[]> {
        const data = await getFileData<Beeper>('beepers');
        if (!data) {
            return false;
        }
        const beeper = data.filter((beeper) => beeper.status === status);
        return beeper ? beeper : false;
    }


    // מחיקת ביפר
    public static async deleteBeeper(id: string): Promise<boolean> {
        const data = await getFileData<Beeper>('beepers');
        if (!data) {
            return false;
        }
        const index = data.findIndex((beeper) => beeper._id === id);
        if (index === -1) {
            return false;
        }
        data.splice(index, 1);
        const res = await writeFileData<Beeper>('beepers', data);
        return res;
    }


   // טיפול במצב טרום פיצוץ ועדכון הפיצוץ לאחר 10 שניות 
    public static async startBombing(data: Beeper[], index: number, location: locationDTO): Promise<void | boolean> {
        data[index].latitude = location.LAT;
        data[index].longitude = location.LON;
        data[index].status = beeperStatus.deployed;
        await writeFileData<Beeper>('beepers', data);
        console.log("10 seconds to boom");
        return new Promise((resolve) => {
            setTimeout(async () => {
                console.log("booooom");
                data[index].status = beeperStatus.detonated;
                data[index].exploded_at = new Date();
                const res = await writeFileData<Beeper>('beepers', data);
                resolve(res);
            }, 10000);
        });
    }


    // בדיקת תקינות נתום המיקום
    public static validationsLocation(location: locationDTO): boolean {
        if (!location.LAT.toString() || !location.LON.toString()) {
            return false;
        }
        return true;
    }

    // בדיקת תקינות נתון הסטטוס
    public static validationsStatus(status: string): boolean {
        if (status !== beeperStatus.manufactured && status !== beeperStatus.assembled && status !== beeperStatus.shipped && status !== beeperStatus.deployed) {
            return false;
        }
        return true;
    }


    //בדיקת תקינות הסטטוס החדש ביחס לסטטוס הישן
    public static validatNewStatus(newStatus: string, current_status: string): boolean {
        switch (newStatus) {
            case beeperStatus.assembled:
                return (current_status == beeperStatus.manufactured);
            case beeperStatus.shipped:
                return (current_status == beeperStatus.assembled);
            case beeperStatus.deployed:
                return (current_status == beeperStatus.shipped);
            default:
                return false;
        }
    }
    

    //יצירת סטטוס החדש ביחס לסטטוס הישן
    public static getNextStatus(status: string): string {
        switch (status) {
            case beeperStatus.manufactured:
                return beeperStatus.assembled;
            case beeperStatus.assembled:
                return beeperStatus.shipped;
            case beeperStatus.shipped:
                return beeperStatus.deployed;
            default:
                return beeperStatus.manufactured;
        }
    }


    // פונקצייה ראשית לטיפול בעדכון סטטוס בהתאם למצב הקודם
    public static async updateStatus(id: string, location: locationDTO): Promise<boolean | Beeper> {
        if (!this.validationsLocation(location)) return false

        const data = await getFileData<Beeper>('beepers');
        if (!data) return false;

        const index = data.findIndex((beeper) => beeper._id === id);
        if (index === -1) return false;
        
        const prev_status = data[index].status;
        const new_status = this.getNextStatus(prev_status);
        data[index].status = new_status;        
        if(new_status == beeperStatus.deployed){
            const bombingResult = await this.startBombing(data, index, location);
            console.log("Bombing completed", bombingResult);
            return true;
        }
        const res = await writeFileData<Beeper>('beepers', data);
        return data[index]
    }


    // בדיקת תקינות כתיבת הסטטוס
    public static validationsLocation2(location: location2DTO): boolean {
        if (location.status !== beeperStatus.manufactured && location.status !== beeperStatus.assembled && location.status !== beeperStatus.shipped && location.status !== beeperStatus.deployed) {
            return false;
        }
        return true;
    }


    // פונקצייה ראשית לטיפול בעדכון סטטוס עם סטטוס מפורש שצויין מהלקוח
    public static async updateStatus2(id: string, statusObj: location2DTO): Promise<boolean | Beeper> {
        try {
            const data = await getFileData<Beeper>('beepers');
            if (!data) return false;
            const index = data.findIndex((beeper) => beeper._id === id);
            if (index === -1) return false;
            if (!this.validationsLocation2(statusObj)) return false

            const current_status = data[index].status;
            const new_status = statusObj.status;

            if (!this.validatNewStatus(new_status, current_status)) return false           
            data[index].status = new_status;

            if (new_status == beeperStatus.deployed) {
                data[index].latitude = statusObj.lat;
                data[index].longitude = statusObj.lon;
                data[index].status = new_status;
                await writeFileData<Beeper>('beepers', data);
                await setTimeout(async () => {
                    console.log("booooom");
                    data[index].status = beeperStatus.detonated;
                    data[index].exploded_at = new Date();
                    const res = await writeFileData<Beeper>('beepers', data);
                    return res
                }, 10000)
                return data[index]
            }           
            const res = await writeFileData<Beeper>('beepers', data);
            return res ? data[index] : res;
        } catch (err) {
            console.log(err)
            return false
        }
    }


}
import Beeper from "../models/Beeper";
import NewBeeperDTO  from "../interfaces/NewBeeperDTO";
import { getFileData, writeFileData } from '../config/fileDAL';
import beeperStatus from "../enums/beeperStatus";
import locationDTO from "../interfaces/locationDTO";

export default class PostService {
    public static async createBeeper(post: NewBeeperDTO) : Promise<boolean | string> {
        
        const {name} = post;
        const newBeeper: Beeper = new Beeper(name);
        const data = await getFileData<Beeper>('beepers');
        if (!data) {
            const res = await writeFileData<Beeper>('beepers', [newBeeper]);
            return res ? newBeeper._id : res;
        }
        data.push(newBeeper);
        const res = await writeFileData<Beeper>('beepers', data);
        return res ? newBeeper._id : res;
    }

    public static async getAllBeepers() : Promise<boolean|Beeper[]> {
        const data = await getFileData<Beeper>('beepers');
        return data ? data : false;
    }

    public static async searchById(id: string) : Promise<boolean|Beeper> {
        const data = await getFileData<Beeper>('beepers');
        if (!data) {
            return false;
        }
        const beeper = data.find((beeper) => beeper._id === id);
        return beeper ? beeper : false;
        
    }

    public static async searchByStatus(status: string) : Promise<boolean|Beeper[]> {
        const data = await getFileData<Beeper>('beepers');
        if (!data) {
            return false;
        }
        const beeper = data.filter((beeper) => beeper.status === status);
        return beeper ? beeper : false;
    }


    public static async deleteBeeper(id: string) : Promise<boolean> {
        const data = await getFileData<Beeper>('beepers');
        if (!data) {
            return false;
        }
        const index  = data.findIndex((beeper) => beeper._id === id);
        if (index === -1) {
            return false;
        }
        data.splice(index, 1);
        const res = await writeFileData<Beeper>('beepers', data);
        return res;
    }


    public static async startBombing(id: string) : Promise<void | boolean> {
        
         const data = await getFileData<Beeper>('beepers');
        console.log("bommmmmmmmmmmm")
        if (!data) {return false;}
        const index  = data.findIndex((beeper) => beeper._id === id);
        if (index === -1) {return false;}
        data[index].status = beeperStatus.detonated
        console.log(data[index].status);
        data[index].exploded_at = new Date();
        const res = await writeFileData<Beeper>('beepers', data);
        return res;
    }

    public static async updateStatus(id: string, location: locationDTO) : Promise<boolean> {
       
        const data = await getFileData<Beeper>('beepers');
        if (!data) {return false}

        const index  = data.findIndex((beeper) => beeper._id === id);
        if (index === -1) {return false}

        const prev_status = data[index].status;
        switch (prev_status) {
            case beeperStatus.manufactured:
                data[index].status = beeperStatus.assembled;
                break;
            case beeperStatus.assembled:
                data[index].status = beeperStatus.shipped;
                break;
            case beeperStatus.shipped:
                data[index].latitude = location.LAT;
                data[index].longitude = location.LON;
                data[index].status = beeperStatus.deployed;
                await writeFileData<Beeper>('beepers', data);
                setInterval(async () => {
                     this.startBombing(id);
                }, 10000);
                return true;
            case beeperStatus.deployed:
                return false;            
        }
        const res = await writeFileData<Beeper>('beepers', data);
        return res;
    }

}
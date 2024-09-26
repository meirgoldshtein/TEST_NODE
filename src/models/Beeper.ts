import { v4 } from 'uuid';
import beeperStatus from '../enams/beeperStatus';
export default class Beeper {
    _id : string
    name : string
    status : string
    created_at : Date
    exploded_at : Date | null
    latitude : number | null 
    longitude : number | null

    constructor(
        _name : string,

    ) {
        this.created_at = new Date();
        this.status = beeperStatus.manufactured;
        this._id = v4();
        this.name = _name;
        this.exploded_at = null;
        this.latitude = null;
        this.longitude = null;
       
    }
}
import e from 'express';
import fs from 'fs/promises';


export const getFileData = async <T>(resource: string) : Promise<T[]|void> => {
    try {
        const data : string = await fs.readFile(`${__dirname}/../../data/${resource}.json`, 'utf8');      
        const JSONdata: T[] = JSON.parse(data);
        return JSONdata ? JSONdata : [];
        
    } catch (err) {
        console.log(err);
    }
}


export const writeFileData = async <T>(resource: string, data: T[]) : Promise<boolean> => {
    try {
        const stringData = JSON.stringify(data, null, 2);
        await fs.writeFile(`${__dirname}/../../data/${resource}.json`, stringData, { encoding: 'utf8' });
        console.log('Data saved to file');
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}


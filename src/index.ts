import exp from 'express';
import 'dotenv/config';
import beeperController from './controllers/beeperController';
const app = exp();

app.use(exp.json());

app.use('/api/beepers', beeperController);



app.listen(process.env.PORT, () => console.log(`Example app listening at http://localhost:${process.env.PORT}`));


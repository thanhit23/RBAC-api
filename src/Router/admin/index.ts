import express, { Express } from 'express';

import authenticate from "./authentication";

const app: Express = express();

app.use('/auth', authenticate);

export default app;

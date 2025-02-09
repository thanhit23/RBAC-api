import cors from 'cors';
import dotenv from "dotenv";
import helmet from 'helmet';
import passport from 'passport';
import bodyParser from "body-parser";
import httpStatus from 'http-status-codes';
import express, { Express, NextFunction } from "express";

import userRoutes from './router/user';
import adminRoutes from './router/admin';

import { Database } from "./database";
import ApiError from "./utils/ApiError";
import jwtStrategy from './config/passport';
import { errorConverter, errorHandler } from "./middlewares/error";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(passport.initialize({}));
passport.use('jwt', jwtStrategy);
app.use(express.json());
app.use(bodyParser.json())

app.use(helmet());

app.use(cors());
app.options('*', cors());

app.use('/v1', userRoutes);
app.use('/v1/admin', adminRoutes);

Database.initialize();


app.use((_, __, next: NextFunction) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

app.use(errorConverter);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

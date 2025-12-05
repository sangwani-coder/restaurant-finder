import express from "express";
import { checkStatus, findRestaurants } from './controllers/searchController';

var morgan = require('morgan');

const app = express();

app.use(express.json());
app.use(morgan('combined'))

//  Routes
app.use("/", checkStatus);
app.use("/api/execute", findRestaurants);

export default app;
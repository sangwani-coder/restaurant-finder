import express from "express";
import { checkStatus, findRestaurants } from './controllers/searchController';


const app = express();

app.use(express.json());

//  Routes
app.use("/", checkStatus);
app.use("/api/execute", findRestaurants);

export default app;
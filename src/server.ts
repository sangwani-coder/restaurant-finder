import app from './app';
import dotenv from 'dotenv';
import { initializeConfig } from './config/config';

dotenv.config();
const config = initializeConfig()

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
})
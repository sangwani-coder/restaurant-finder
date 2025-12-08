import app from './app';
import dotenv from 'dotenv';
import { initializeConfig } from './config/config';

dotenv.config();
const config = initializeConfig()

app.listen(config.port,'192.168.8.100', () => {
    console.log(`Server is running on port ${config.port}`);
})
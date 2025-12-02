import { Router } from 'express';
import { checkStatus, findRestaurants } from '../controllers/searchController';

const router = Router();

router.get('/api', checkStatus);
router.get('/api/execute', findRestaurants);

export default router;
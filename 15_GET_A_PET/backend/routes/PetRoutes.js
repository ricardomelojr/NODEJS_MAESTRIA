// * ROUTER
import { Router } from 'express';

// * CONTROLLERS
import PetController from '../controllers/PetController.js';

const router = Router();

router.post('/create', PetController.create);

export default router;

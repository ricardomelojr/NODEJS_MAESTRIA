import express from 'express';
const router = express.Router();

/* MODELS */
import Toughts from '../models/Tought.js';

/* CONTROLLERS */
import ToughtsController from '../controllers/ToughtsController.js';

/* HELPERS */
import checkAuth from '../helpers/auth.js';

/* GET */
router.get('/', ToughtsController.showToughts);
router.get('/dashboard', checkAuth, ToughtsController.dashboard);
router.get('/add', checkAuth, ToughtsController.createTought);
router.get('/edit/:id', checkAuth, ToughtsController.updateTought);

/* POST */
router.post('/add', checkAuth, ToughtsController.createToughtSave);
router.post('/remove', checkAuth, ToughtsController.removeTought);
router.post('/edit', checkAuth, ToughtsController.updateToughtSave);

export default router;

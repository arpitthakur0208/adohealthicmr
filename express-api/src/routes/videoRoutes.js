import { Router } from 'express';
import * as ctrl from '../controllers/videoController.js';

const router = Router();
router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.delete('/:moduleId/:videoType/:videoId', ctrl.remove);
export default router;

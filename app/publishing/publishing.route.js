import express from 'express';

// Controllers
import { getAllPublishingController } from './publishing.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/').get(getAllPublishingController);

export default router;

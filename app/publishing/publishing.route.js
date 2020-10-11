import express from 'express';

// Controllers
import {
  getAllPublishingController,
  getPublishingByIdController,
  createPublishingController,
  updatePublishingController,
  deletePublishingController
} from './publishing.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/').get(getAllPublishingController);
router.route('/:id').get(getPublishingByIdController);
router.route('/').post(createPublishingController);
router.route('/:id').put(updatePublishingController);
router.route('/:id').delete(deletePublishingController);

export default router;

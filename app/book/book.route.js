import express from 'express';

// Controllers
import {
  getAllBookController,
  getBookByIdController,
  createBookController,
  updateBookController,
  deleteBookController
} from './book.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/').get(getAllBookController);
router.route('/:id').get(getBookByIdController);
router.route('/').post(createBookController);
router.route('/:id').put(updateBookController);
router.route('/:id').delete(deleteBookController);

export default router;

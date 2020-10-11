import express from 'express';

// Controllers
import {
  getAllAuthorController,
  getAuthorByIdController,
  createAuthorController,
  updateAuthorController,
  deleteAuthorController
} from './author.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/').get(getAllAuthorController);
router.route('/:id').get(getAuthorByIdController);
router.route('/').post(createAuthorController);
router.route('/:id').put(updateAuthorController);
router.route('/:id').delete(deleteAuthorController);

export default router;

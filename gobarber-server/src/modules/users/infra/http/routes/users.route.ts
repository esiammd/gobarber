import multer from 'multer';
import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import uploadConfig from '@config/upload';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import UsersController from '../controllers/UsersController';
import UserAvatartController from '../controllers/UserAvatarController';

const usersRoute = Router();
const usersControllers = new UsersController();
const userAvatartController = new UserAvatartController();

const upload = multer(uploadConfig.multer);

usersRoute.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      passwordConfirmation: Joi.string().required().valid(Joi.ref('password')),
    },
  }),
  usersControllers.create,
);

usersRoute.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  userAvatartController.update,
);

export default usersRoute;

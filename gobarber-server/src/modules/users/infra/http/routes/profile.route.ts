import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import ProfileController from '../controllers/ProfileController';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(ensureAuthenticated);

profileRouter.get('/', profileController.show);
profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      oldPassword: Joi.string(),
      password: Joi.string().when('oldPassword', {
        then: Joi.required(),
      }),
      passwordConfirmation: Joi.string()
        .when('password', {
          then: Joi.required(),
        })
        .valid(Joi.ref('password')),
    },
  }),
  profileController.update,
);

export default profileRouter;

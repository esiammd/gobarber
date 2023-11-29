import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import Appointmentscontroller from '../controllers/AppointmentsController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

const appointmentsRoute = Router();
const appointmentsController = new Appointmentscontroller();
const providerAppointmentsController = new ProviderAppointmentsController();

appointmentsRoute.use(ensureAuthenticated);

appointmentsRoute.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      providerId: Joi.string().uuid().required(),
      date: Joi.date().required(),
    },
  }),
  appointmentsController.create,
);
appointmentsRoute.get('/me', providerAppointmentsController.index);

export default appointmentsRoute;

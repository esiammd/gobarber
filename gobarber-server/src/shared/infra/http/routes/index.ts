import { Router } from 'express';

import providersRoute from '@modules/appointments/infra/http/routes/providers.route';
import appointmentsRouter from '@modules/appointments/infra/http/routes/appointments.route';

import usersRouter from '@modules/users/infra/http/routes/users.route';
import sessionsRoute from '@modules/users/infra/http/routes/sessions.route';
import passwordRoute from '@modules/users/infra/http/routes/password.route';
import profileRoute from '@modules/users/infra/http/routes/profile.route';

const routes = Router();

routes.use('/providers', providersRoute);
routes.use('/appointments', appointmentsRouter);

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRoute);
routes.use('/password', passwordRoute);
routes.use('/profile', profileRoute);

export default routes;

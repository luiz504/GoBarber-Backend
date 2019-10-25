import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format } from 'date-fns';

import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';
import Notification from '../schema/Notification.';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'date'],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { provider_id, date } = req.body;

    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });
    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'you can only create appointments with providers' });
    }

    // check for past dates
    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(401).json({ error: 'Past dates are not permitted' });
    }

    // check availability
    const appointmentAvailable = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (appointmentAvailable) {
      return res
        .status(401)
        .json({ error: 'Appointment data is not available' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart,
    });

    const user = await User.findByPk(req.userId);
    const formattedDate = format(hourStart, "'for' MMMM do 'at' H:mm'h'");
    // provider appointment notification
    await Notification.create({
      content: `A new appointment of '${user.name}' ${formattedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();

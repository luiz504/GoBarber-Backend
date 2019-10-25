import { format, parseISO } from 'date-fns';

import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancelattionMail'; // each job needs a unique key
  }

  async handle({ data }) {
    const { appointment } = data;

    await Mail.sendMail({
      to: `${appointment.provider.name}<${appointment.provider.email}>`,
      subject: 'Appointment canceled',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(parseISO(appointment.date), "MMMM do 'at' H:mm'h'"),
      },
    });
  }
}

export default new CancellationMail();

// import CancellationMail from ...
// CancellationMail.key

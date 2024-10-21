import { SimpleConsoleLogger } from 'typeorm';
import { config } from '../config';
import { RESERVATION_TYPE, RESERVATION_TYPE_ID } from '../constants';
import { ReservationState } from '../entities/reservation-state.entity';
import { ISendEmail } from '../interfaces/main.interface';
import { IUpdateState } from '../interfaces/reservation.interface';
import { reservationRepository } from '../repositories/reservation.repository';
import { serverMessage, errorName } from '../utils/message.util';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { fileUtil } from '../utils/file.util';

class MainService {
  async sendEmail(sendEmailDto: ISendEmail) {
    const transporter = nodemailer.createTransport({
      host: config.email.host,
      port: Number(config.email.port),
      secure: false,
      auth: {
        user: config.email.username,
        pass: config.email.password,
      },
    });

    const content = sendEmailDto.content;

    const mailOptions: Mail.Options = {
      from: `MoYe <${config.email.username}>`,
      to: sendEmailDto.receiver,
      subject: sendEmailDto.subject,
      html: content,
      attachments: [{
        filename: 'Logo.png',
        path: fileUtil.join(fileUtil.cwd, 'Logo.png'),
        cid: 'logo'
      }]
    };

    const result = await transporter.sendMail(mailOptions);

    return result;
  }
}

export const mainService = new MainService();

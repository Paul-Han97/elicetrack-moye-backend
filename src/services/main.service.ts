import { SimpleConsoleLogger } from 'typeorm';
import { config } from '../config';
import { RESERVATION_TYPE, RESERVATION_TYPE_ID } from '../constants';
import { ReservationState } from '../entities/reservation-state.entity';
import { ISendEmail } from '../interfaces/main.interface';
import { IUpdateOneDTo } from '../interfaces/reservation.interface';
import { reservationRepository } from '../repositories/reservation.repository';
import { serverMessage, statusMessage } from '../utils/message.util';
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

    // const content = `<div style="margin: 0 auto; padding: 10px; display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #fff; width: 600px; height: 400px; border-radius: 5px; border: 6px solid #A8E1B2;">
    //    <div style="background-image: url('http://kdt-react-node-1-team01.elicecoding.com:5000/api/static/LogoGreen.svg'); background-repeat: no-repeat; background-size: contain; width: 100px; height: 42px; margin-left: 10px; margin-bottom: 34px;"></div>        <div style="font-size: 20px; margin-bottom: 20px; text-align: center;">
    //       안녕하세요, <span style="color: #3C9A5D; font-weight: 600;">${sendEmailDto.userName}님!</span>
    //     </div>
    //     <div style="line-height: 30px;">
    //       모두의 예약을 돕는 <span style="color: #3C9A5D; font-weight: 600;">MoYe</span> 입니다.<br />
    //       ${sendEmailDto.userName}님, <span style="color: #3C9A5D; font-weight: 600;">${sendEmailDto.storeName}의 ${sendEmailDto.storeStartTime} 예약이 확정</span> 되었습니다.<br />
    //       즐거운 시간 보내시길 바랍니다!
    //       </div>
    //     </div>
    //     <img src=''>`;

    const content = sendEmailDto.content;

        console.log(fileUtil.cwd);
    const mailOptions: Mail.Options = {
      from: `MoYe <${config.email.username}>`,
      to: sendEmailDto.receiver,
      subject: sendEmailDto.subject,
      html: content,
      // attachments: [{
      //   filename: 'image.jpg',
      //   path: fileUtil.join(fileUtil.cwd, 'image.jpg'),
      //   cid: config.email.username
      // }]
    };

    const result = await transporter.sendMail(mailOptions);

    console.log(result);
    // const result = transporter.verify(function (error, success) {
    //     if(error) {
    //         console.log(error);
    //     } else {
    //         console.log('ready email');
    //     }
    // });
    return result;
  }
}

export const mainService = new MainService();

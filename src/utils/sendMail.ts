import { promisify } from 'util';
import * as sendmailConstructor from 'sendmail';
const sendmail = promisify(sendmailConstructor({ silent: true }));

export const sendMail = (to: string, subject: string, message: string) => {
  sendmail({
    from: 'no-reply@find-doggo.com',
    to,
    subject,
    html: message,
  });
};

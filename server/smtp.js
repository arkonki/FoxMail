import nodemailer from 'nodemailer';

export async function sendEmail(account, emailData) {
  const transporter = nodemailer.createTransport({
    host: 'mail.veebimajutus.ee',
    port: 465,
    secure: true,
    auth: {
      user: account.email,
      pass: account.password,
    },
  });

  const mailOptions = {
    from: account.email,
    to: emailData.to.join(', '),
    cc: emailData.cc?.join(', '),
    bcc: emailData.bcc?.join(', '),
    subject: emailData.subject,
    html: emailData.body,
    attachments: emailData.attachments || [],
  };

  await transporter.sendMail(mailOptions);
}

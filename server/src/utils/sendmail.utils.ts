import nodemailer from "nodemailer";

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: `${process.env.GMAIL_ADDRESS}`,
    pass: `${process.env.GOOGLE_APP_PASSWORD}`,
  },
});

export const sendMail = (
  from: string = process.env.GMAIL_ADDRESS ?? "",
  to: string,
  subject: string,
  text: string
) => {
  var mailOptions = { from, to, subject, text };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

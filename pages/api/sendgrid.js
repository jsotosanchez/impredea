import sendgrid from '@sendgrid/mail';

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(req, res) {
  try {
    await sendgrid.send({
      to: `${req.body.to}`,
      from: `${req.body.from}`,
      subject: `Problema Reportado: ${req.body.subject}`,
      html: `${req.body.message}`,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }

  return res.status(200).json({});
}

export default sendEmail;

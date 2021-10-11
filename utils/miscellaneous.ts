interface EmailRequestBody {
  to: string;
  from: string;
  subject: string;
  message: string;
}
export const removeEmptyFields = (object: Object) =>
  Object.fromEntries(Object.entries(object).filter(([_, v]) => v != null));

export const sendEmail = async (requestBody: EmailRequestBody) => {
  const res = await fetch('/api/sendgrid', {
    body: JSON.stringify({
      to: requestBody.to,
      from: requestBody.from,
      subject: requestBody.subject,
      message: requestBody.message,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  return await res.json();
};

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

export const uploadPhoto = async (e: any, fileName: string) => {
  const file = e.target.files[0];
  const res = await fetch(`/api/upload-url?file=${fileName}`);
  const { url, fields } = await res.json();
  const formData = new FormData();

  Object.entries({ ...fields, file }).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const upload = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (upload.ok) {
    console.log('Uploaded successfully!');
  } else {
    console.error('Upload failed.');
  }
  console.log(upload);
};

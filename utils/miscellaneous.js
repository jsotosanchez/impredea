import { BUCKET_FILES_URL } from "./constants";

export const removeEmptyFields = (object) => Object.fromEntries(Object.entries(object).filter(([_, v]) => v != null));

export const sendEmail = async (requestBody) => {
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

export const uploadPhoto = async (e, fileName) => {
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
    return { success: true };
  }
  return { error: true };
};
export const uploadFile = async (file, fileName) => {
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
    return { success: true };
  }
  return { error: true };
};

export const createMercadoPagoLink = async (requestBody) => {
  const res = await fetch('/api/payment', {
    body: JSON.stringify({
      items: requestBody.items,
      quotationId: requestBody.quotationId,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });
  return await res.json();
};

export const downloadFile = async (fileName, mimeType = 'application/octet-stream') => {
  await fetch(`/api/download-file?fileKey=${fileName}`, {
    headers: {
      'Content-Type': mimeType,
    },
    method: 'POST',
  }).then(data => data.blob()).then(blobFile => {
    const fileURL = URL.createObjectURL(blobFile);
    window.open(fileURL)
  });
}

export const getProductPicUrl = (pid) => `${BUCKET_FILES_URL}products/${pid}`
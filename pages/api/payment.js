import mercadopago from 'mercadopago';

const configureMercadoPago = () => {
  try {
    mercadopago.configure({
      access_token: process.env.MERCADOPAGO_CLIENT_SECRET,
    });
  } catch (error) {
    console.log(error);
  }
};

export default async function payment(req, res) {
  configureMercadoPago();

  const { items } = req.body;
  const preferences = {
    items,
    back_urls: {
      success: 'http://localhost:3000',
      failure: 'http://localhost:3000',
      pending: 'http://localhost:3000',
    },
    auto_return: 'approved',
  };
  mercadopago.preferences
    .create(preferences)
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      res.status(403).send(error);
    });
}

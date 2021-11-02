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

  const { items, quotationId } = req.body;
  const preferences = {
    items,
    back_urls: {
      success: `http://localhost:3000/handlePayment/quotation/${quotationId}`,
      failure: `http://localhost:3000/handlePayment/quotation/${quotationId}`,
      pending: `http://localhost:3000/handlePayment/quotation/${quotationId}`,
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

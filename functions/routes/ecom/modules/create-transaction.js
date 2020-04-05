exports.post = ({ appSdk }, req, res) => {
  appSdk
    .getAuth(req.storeId)
    .then(() => {
      const { params } = req.body
      const { amount } = params
      const transaction = {
        intermediator: {
          payment_method: params.payment_method
        },
        currency_id: params.currency_id,
        currency_symbol: params.currency_symbol,
        discount: amount.discount,
        amount: amount.total,
        status: {
          current: 'pending'
        },
        flags: [
          'app-custom-payments'
        ]
      }

      const payload = {
        redirect_to_payment: false,
        transaction
      }

      res.send(payload)
    })
    .catch(err => {
      console.error(err)
      res.status(err.statusCode || 500)
      const { message } = err
      res.send({
        error: 'CREATE_TRANSACTION_ERR',
        message
      })
    })
}

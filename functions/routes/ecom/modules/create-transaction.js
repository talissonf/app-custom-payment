exports.post = ({ appSdk }, req, res) => {
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
}

exports.post = ({ appSdk }, req, res) => {
  const { params, application } = req.body
  const config = Object.assign({}, application.hidden_data, application.data)

  // start mounting response body
  // https://apx-mods.e-com.plus/api/v1/list_payments/response_schema.json?store_id=100
  const response = {
    payment_gateways: []
  }

  const amount = params.amount || {}

  // calculate discount value
  const { discount } = config
  if (discount && discount.value > 0) {
    if (discount.apply_at !== 'freight') {
      // default discount option
      const { value } = discount
      response.discount_option = {
        label: config.discount_option_label,
        value
      }
      // specify the discount type and min amount is optional
      ;['type', 'min_amount'].forEach(prop => {
        if (discount[prop]) {
          response.discount_option[prop] = discount[prop]
        }
      })
    }
  }

  if (config.payment_options && config.payment_options.length) {
    config.payment_options.forEach(options => {
      const { label, icon, text, discount, enabled } = options
      if (enabled && enabled === true) {
        if (options.min_amount && (amount.total < options.min_amount)) {
          return
        }

        response.payment_gateways.push({
          label,
          icon,
          text,
          discount,
          payment_method: options.payment_method,
          type: 'payment'
        })
      }
    })
  }

  return res.send(response)
}

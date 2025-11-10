// src/middlewares/validators.js
const { celebrate, Joi, Segments } = require('celebrate');

const authSignup = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(80).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required().messages({
      'string.min': 'Essa senha não atende aos requisitos',
      'any.required': 'Essa senha não atende aos requisitos',
      'string.empty': 'Essa senha não atende aos requisitos'
    })
  })
}, {
  abortEarly: false
});

const authLogin = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
  })
});

const productsList = celebrate({
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    only_month: Joi.boolean().default(false)
  })
});

const cartAddItem = celebrate({
  [Segments.BODY]: Joi.object({
    product_id: Joi.number().integer().min(1).required(),
    quantity: Joi.number().integer().min(1).required(),
    note: Joi.string().max(500).allow('', null)
  })
});

const checkoutPix = celebrate({
  [Segments.BODY]: Joi.object({
    delivery_type: Joi.string().valid('retirada', 'delivery').required(),
    payment_method: Joi.string().valid('pix', 'credit_card').optional()
  })
});

const orderIdParam = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.alternatives().try(
      Joi.number().integer().min(1),
      Joi.string().min(1).max(20)
    ).required()
  })
});

const orderAdvance = celebrate({
  [Segments.BODY]: Joi.object({
    next_status: Joi.string().valid('ready', 'delivered', 'canceled').required()
  })
});

const orderReview = celebrate({
  [Segments.BODY]: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().max(1000).allow('', null)
  })
});

module.exports = {
  authSignup,
  authLogin,
  productsList,
  cartAddItem,
  checkoutPix,
  orderIdParam,
  orderAdvance,
  orderReview
};

const Joi = require('joi');

// Password complexity validation
const passwordSchema = Joi.string()
  .min(8)
  .max(128)
  .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'))
  .required()
  .messages({
    'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
    'string.min': 'Password must be at least 8 characters long',
    'string.max': 'Password must not exceed 128 characters',
    'any.required': 'Password is required'
  });

// User registration validation
const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .max(255)
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.max': 'Email must not exceed 255 characters',
      'any.required': 'Email is required'
    }),
  password: passwordSchema,
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Confirm password must match password',
      'any.required': 'Confirm password is required'
    }),
  fullname: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Full name must be at least 2 characters long',
      'string.max': 'Full name must not exceed 100 characters',
      'any.required': 'Full name is required'
    }),
  phone: Joi.string()
    .pattern(/^[0-9]{9,15}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must contain only digits and be 9-15 characters long',
      'any.required': 'Phone number is required'
    }),
  birth: Joi.date()
    .max('now')
    .optional()
    .messages({
      'date.max': 'Birth date cannot be in the future'
    }),
  gender: Joi.string()
    .valid('Nam', 'Nữ')
    .required()
    .messages({
      'any.only': 'Gender must be either "Nam" or "Nữ"',
      'any.required': 'Gender is required'
    }),
  address: Joi.string()
    .min(10)
    .max(500)
    .required()
    .messages({
      'string.min': 'Address must be at least 10 characters long',
      'string.max': 'Address must not exceed 500 characters',
      'any.required': 'Address is required'
    })
});

// User login validation
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
});

// User update validation
const updateUserSchema = Joi.object({
  fullname: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Full name must be at least 2 characters long',
      'string.max': 'Full name must not exceed 100 characters'
    }),
  phone: Joi.string()
    .pattern(/^[0-9]{9,15}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Phone number must contain only digits and be 9-15 characters long'
    }),
  birth: Joi.date()
    .max('now')
    .optional()
    .messages({
      'date.max': 'Birth date cannot be in the future'
    }),
  gender: Joi.string()
    .valid('Nam', 'Nữ')
    .optional()
    .messages({
      'any.only': 'Gender must be either "Nam" or "Nữ"'
    }),
  image: Joi.string()
    .uri()
    .optional()
    .allow('')
    .messages({
      'string.uri': 'Image must be a valid URL'
    }),
  address: Joi.string()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Address must not exceed 500 characters'
    }),
  email: Joi.string()
    .email()
    .max(255)
    .optional()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.max': 'Email must not exceed 255 characters'
    }),
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'))
    .optional()
    .messages({
      'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password must not exceed 128 characters'
    })
});

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true 
    });
    
    if (error) {
      const errorMessages = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorMessages
      });
    }
    
    // Replace req.body with validated and sanitized data
    req.body = value;
    next();
  };
};

// Refresh token schema
const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string()
    .required()
    .messages({
      'any.required': 'Refresh token is required',
      'string.empty': 'Refresh token cannot be empty'
    })
});

module.exports = {
  validateRegister: validate(registerSchema),
  validateLogin: validate(loginSchema),
  validateUpdateUser: validate(updateUserSchema),
  validateRefreshToken: validate(refreshTokenSchema),
  passwordSchema
};

// src/middlewares/validators.js
import { body, param, validationResult } from "express-validator";

export const validateCreateTicket = [
  param("userName").isString().notEmpty().withMessage("userName es requerido y debe ser string"),
  param("profileName").isString().notEmpty().withMessage("profileName es requerido y debe ser string"),
  body("quantity")
    .isInt({ min: 1 })
    .withMessage("quantity debe ser un entero mayor que 0"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

// Puedes definir más validaciones para otros endpoints de forma similar

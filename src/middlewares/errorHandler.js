// src/middlewares/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  // Puedes personalizar mensajes según tipo de error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Error interno del servidor",
  });
};

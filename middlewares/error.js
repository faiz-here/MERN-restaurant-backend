class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }


  if (err.name === 'ValidationError') {
    const validationErrors = Object.values(error.errors).map(err => err.message);
    return next(new ErrorHandler(validationErrors.join(', '), 400));
  }
   
  if (err.code === 11000) { // MongoDB duplicate key error code
    // Check which field caused the duplicate error
    if (err.keyValue.email) {
      res.status(400).send({
        message: "This email already exists. Please use a different email.",
      });
    } else  {
      res.status(400).send({
        message: "This phone number already exists. Please use a different phone number.",
      });
    } 
  } 



  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default ErrorHandler;

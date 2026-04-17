// const errorHandler = (err, req, res, next) => {
  
//   console.error('ERROR OCCURRED:', err);
//   console.log("STACK TRACE:\n", err.stack); 
//   let statusCode = err.statusCode || 500;
//   let message = err.message || 'Internal Server Error';
//   // Mongoose duplicate key
//   if (err.code === 11000) {
//     const field = Object.keys(err.keyValue)[0];
//     message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
//     statusCode = 400;
//   }

//   // Mongoose validation error
//   if (err.name === 'ValidationError') {
//     message = Object.values(err.errors).map(e => e.message).join(', ');
//     statusCode = 400;
//   }

//   // Mongoose bad ObjectId
//   if (err.name === 'CastError') {
//     message = `Resource not found with id of ${err.value}`;
//     statusCode = 404;
//   }

//   // JWT errors
//   if (err.name === 'JsonWebTokenError') {
//     message = 'Invalid token';
//     statusCode = 401;
//   }

//   if (err.name === 'TokenExpiredError') {
//     message = 'Token expired';
//     statusCode = 401;
    
//   }

//   res.status(statusCode).json({
//     success: false,
//     message,
//     ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
//   });
// };

// class AppError extends Error {
//   constructor(message, statusCode) {
//     super(message);
//     this.statusCode = statusCode;
//     this.isOperational = true;
//     Error.captureStackTrace(this, this.constructor);
//   }
// }
// console.log("STACK TRACE:\n", err.stack);

// module.exports = { errorHandler, AppError };

const errorHandler = (err, req, res, next) => {
  console.error('ERROR OCCURRED:', err);
  console.log("STACK TRACE:\n", err.stack); // ✅ INSIDE function

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    statusCode = 400;
  }

  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map(e => e.message).join(', ');
    statusCode = 400;
  }

  if (err.name === 'CastError') {
    message = `Resource not found with id of ${err.value}`;
    statusCode = 404;
  }

  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token';
    statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    message = 'Token expired';
    statusCode = 401;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = { errorHandler };
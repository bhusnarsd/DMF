// const express = require('express');
// // const helmet = require('helmet');
// const xss = require('xss-clean');
// const mongoSanitize = require('express-mongo-sanitize');
// const compression = require('compression');
// const cors = require('cors');
// const passport = require('passport');
// const httpStatus = require('http-status');
// const socketIo = require('socket.io');
// const config = require('./config/config');
// const morgan = require('./config/morgan');
// const { jwtStrategy } = require('./config/passport');
// const { authLimiter } = require('./middlewares/rateLimiter');
// const routes = require('./routes/v1');
// const { errorConverter, errorHandler } = require('./middlewares/error');
// const ApiError = require('./utils/ApiError');

// const app = express();

// if (config.env !== 'test') {
//   app.use(morgan.successHandler);
//   app.use(morgan.errorHandler);
// }

// // set security HTTP headers
// // app.use(helmet());

// // parse json request body
// app.use(express.json());

// // parse urlencoded request body
// app.use(express.urlencoded({ extended: true }));

// // sanitize request data
// app.use(xss());
// app.use(mongoSanitize());

// // gzip compression
// app.use(compression());

// // enable cors
// app.use(cors());
// app.options('*', cors());

// // jwt authentication
// app.use(passport.initialize());
// passport.use('jwt', jwtStrategy);

// // limit repeated failed requests to auth endpoints
// if (config.env === 'production') {
//   app.use('/v1/auth', authLimiter);
// }

// // v1 api routes
// app.use('/v1', routes);

// // Socket.io connection
// io.on('connection', (socket) => {
//   console.log('New client connected');
//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });
// });

// // Emit notification to specific users
// const sendNotificationToUsers = (notification, userIds) => {
//   userIds.forEach((userId) => {
//     io.to(userId).emit('notification', notification);
//   });
// };

// // Make `io` accessible in routes
// app.set('socketio', io);
// // send back a 404 error for any unknown api request
// app.use((req, res, next) => {
//   next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
// });

// // convert error to ApiError, if needed
// app.use(errorConverter);

// // handle error
// app.use(errorHandler);

// module.exports = app;

const express = require('express');
const http = require('http');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const socketIo = require('socket.io');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const Message = require('./models');
const logger = require('./config/logger');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Connect to MongoDB
// MongoDB schema and model for chat messages

// Set up Socket.IO
io.on('connection', (socket) => {
  logger.info('A user connected');

  // Listen for new messages
  socket.on('message', async (data) => {
    const newMessage = new Message(data);
    await newMessage.save();

    // Broadcast the new message to all connected clients
    io.emit('message', newMessage);
  });

  socket.on('disconnect', () => {
    logger.info('A user disconnected');
  });
});

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
// app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = server; // Export server to start it in index.js

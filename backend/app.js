const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

dotenv.config({ path: 'config/.env' });

app.use(cors());
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(
  bodyParser.json({ limit: '50mb', extended: true, parameterLimit: 50000 })
);
app.use(bodyParser.urlencoded({ extended: true, parameterLimit: 50000 }));
app.use(cookieParser());

// Routes
const UserAuth = require('./routes/UserRoutes/UserAuthRoutes');
const UserRoutes = require('./routes/UserRoutes/UserRoutes');
const AlbumRoutes = require('./routes/AlbumRoutes');
const PostRoutes = require('./routes/PostRoutes');
const VideoRoutes = require('./routes/VideoRoutes');
const GroupRoutes = require('./routes/GroupRoutes');
const PageRoutes = require('./routes/PageRoutes');
const NotificationRoutes = require('./routes/NotificationRoutes');
const SupporterAuthRoutes = require('./routes/SupporterRoutes/SupporterAuthRoutes');
const SupporterRoutes = require('./routes/SupporterRoutes/SupporterRoutes');

const ErrorResponse = require('./middleWares/ErrorResponse');

// Routes MiddleWares
app.use('/supporter', SupporterAuthRoutes);
app.use('/support', SupporterRoutes);
app.use('/api/v1/auth', UserAuth);
app.use('/api/v1/users', UserRoutes);
app.use('/api/v1/albums', AlbumRoutes);
app.use('/api/v1/posts', PostRoutes);
app.use('/api/v1/videos', VideoRoutes);
app.use('/api/v1/groups', GroupRoutes);
app.use('/api/v1/pages', PageRoutes);
app.use('/api/v1/notifications', NotificationRoutes);

// Middleware to handle errors
// app.use((err, req, res, next) => {
//   if (err.name === 'UnauthorizedError') {
//     return res.status(401).json({ error: 'Invalid token' });
//   }
//   return res.status(500).json({ error: err.message });
// });

app.use(ErrorResponse);

module.exports = app;

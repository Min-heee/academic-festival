const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const authRouter = require('./routes/auth');
const coursesRouter = require('./routes/courses');
const noticesRouter = require('./routes/notices');

const app = express();
const port = 3022;

mongoose.connect('mongodb://localhost:27017/mywebsite', {
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

app.use(express.json());
app.use(session({
  secret: 'secret',
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/mywebsite' }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false // 개발 환경에서는 false, 프로덕션에서는 true로 설정
  }
}));

app.use(express.static('public'));

// 라우트 설정
app.use('/auth', authRouter);
app.use('/courses', coursesRouter);
app.use('/notices', noticesRouter);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

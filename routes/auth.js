const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

// 회원가입 라우트
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// 로그인 라우트
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user._id;  // 세션에 사용자 ID 저장
    req.session.username = user.username; // 세션에 사용자 이름 저장
    res.status(200).send('Logged in');
  } else {
    res.status(400).send('Invalid credentials');
  }
});

// 로그아웃 라우트
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('로그아웃 중 오류가 발생했습니다.');
    }
    res.clearCookie('connect.sid');
    res.status(200).send('Logged out');
  });
});

// 로그인 상태 확인 라우트
router.get('/status', (req, res) => {
  if (req.session.userId) {
    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false });
  }
});

// 사용자 이름 반환 라우트
router.get('/username', (req, res) => {
  if (req.session.username) {
    res.json({ username: req.session.username });
  } else {
    res.status(401).send('로그인 필요');
  }
});

module.exports = router;

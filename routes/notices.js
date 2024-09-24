const express = require('express');
const Notice = require('../models/Notice');
const Comment = require('../models/Comment');
const router = express.Router();

router.get('/', async (req, res) => {
  const notices = await Notice.find();
  res.send(notices);
});

router.get('/:noticeId', async (req, res) => {
  const notice = await Notice.findById(req.params.noticeId);
  res.send(notice);
});

router.post('/', async (req, res) => {
  const { title, content } = req.body;
  const notice = new Notice({ title, content });
  
  try {
    await notice.save();
    res.status(201).send(notice);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/:noticeId/comments', async (req, res) => {
  const comments = await Comment.find({ noticeId: req.params.noticeId });
  res.send(comments);
});

router.post('/:noticeId/comments', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send('로그인 후 이용해주세요.');
  }

  const { content } = req.body;
  const { noticeId } = req.params;
  const comment = new Comment({
    content,
    noticeId,
    userId: req.session.userId
  });

  try {
    await comment.save();
    res.status(201).send(comment);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;

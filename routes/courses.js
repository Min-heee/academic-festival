const express = require('express');
const router = express.Router();
const Course = require('../models/Course'); // 필요한 모델 가져오기
const User = require('../models/User'); // 필요한 모델 가져오기

const courseList = {
  ai: { title: '인공지능', professor: '송태원', capacity: 40, enrolled: 35 },
  web: { title: '고급웹프로그래밍', professor: '전창완', capacity: 40, enrolled: 40 },
  iot: { title: 'IoT플랫폼', professor: '윤재석', capacity: 40, enrolled: 35 },
  micro: { title: '마이크로프로세서', professor: '김동민', capacity: 40, enrolled: 35 }
};

// 수강 신청 라우트
router.post('/enroll', async (req, res) => {
  const { course } = req.body;
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).send('로그인 후 이용해주세요.');
  }

  if (!Array.isArray(req.session.userCourses)) {
    req.session.userCourses = [];
  }

  if (req.session.userCourses.includes(course)) {
    return res.status(400).send('이미 신청한 과목입니다.');
  }

  if (courseList[course].enrolled >= courseList[course].capacity) {
    return res.status(400).send('수강 인원이 초과되었습니다.');
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('사용자를 찾을 수 없습니다.');
    }

    const courseDoc = new Course({
      title: courseList[course].title,
      description: `${courseList[course].title} 강의`,
      userId: user._id
    });
    await courseDoc.save();

    req.session.userCourses.push(course);
    courseList[course].enrolled += 1;
    req.session.save(err => {
      if (err) {
        return res.status(500).send('세션 저장 중 오류가 발생했습니다.');
      }
      res.status(200).json({ enrolled: courseList[course].enrolled, capacity: courseList[course].capacity });
    });
  } catch (error) {
    console.error('수강신청 처리 중 오류가 발생했습니다:', error);
    res.status(500).send('수강신청 처리 중 오류가 발생했습니다.');
  }
});

// 수강 상태 조회 라우트
router.get('/status', async (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).send('로그인 후 이용해주세요.');
  }

  try {
    const userEnrolledCourses = await Course.find({ userId });
    res.status(200).json(userEnrolledCourses);
  } catch (error) {
    console.error('수강 상태 불러오기 중 오류가 발생했습니다:', error);
    res.status(500).send('수강 상태 불러오기 중 오류가 발생했습니다.');
  }
});

// 수강 목록 조회 라우트 (수강 인원 업데이트용)
router.get('/course-list', (req, res) => {
  res.status(200).json(courseList);
});

module.exports = router;

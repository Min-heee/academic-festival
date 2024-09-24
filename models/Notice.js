const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }
});

const Notice = mongoose.model('Notice', noticeSchema);

// 초기 데이터 추가
(async () => {
  if ((await Notice.countDocuments()) === 0) {
    await Notice.create([
      { title: '종강입니다!', content: '방학동안 알차게 보내다 오세요.' },
      { title: '개강은 9월2일입니다.', content: '개강은 9월2일입니다.' }
    ]);
  }
})();

module.exports = Notice;

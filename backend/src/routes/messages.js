const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try { res.json(await Message.find().sort({ createdAt: -1 })); }
  catch (e) { res.status(500).json({ message: e.message }); }
});
router.post('/', async (req, res) => {
  try {
    const msg = new Message(req.body);
    await msg.save();
    res.status(201).json({ message: 'Message sent successfully!' });
  } catch (e) { res.status(400).json({ message: e.message }); }
});
router.patch('/:id/read', auth, async (req, res) => {
  try { res.json(await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true })); }
  catch (e) { res.status(500).json({ message: e.message }); }
});
router.delete('/:id', auth, async (req, res) => {
  try { await Message.findByIdAndDelete(req.params.id); res.json({ message: 'Message deleted' }); }
  catch (e) { res.status(500).json({ message: e.message }); }
});
module.exports = router;

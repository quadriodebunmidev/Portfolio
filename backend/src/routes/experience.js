const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try { res.json(await Experience.find().sort({ startDate: -1 })); }
  catch (e) { res.status(500).json({ message: e.message }); }
});
router.post('/', auth, async (req, res) => {
  try {
    const exp = new Experience(req.body);
    await exp.save();
    res.status(201).json(exp);
  } catch (e) { res.status(400).json({ message: e.message }); }
});
router.put('/:id', auth, async (req, res) => {
  try { res.json(await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (e) { res.status(400).json({ message: e.message }); }
});
router.delete('/:id', auth, async (req, res) => {
  try { await Experience.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (e) { res.status(500).json({ message: e.message }); }
});
module.exports = router;

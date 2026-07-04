const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try { res.json(await Testimonial.find().sort({ createdAt: -1 })); }
  catch (e) { res.status(500).json({ message: e.message }); }
});
router.post('/', auth, async (req, res) => {
  try { const t = new Testimonial(req.body); await t.save(); res.status(201).json(t); }
  catch (e) { res.status(400).json({ message: e.message }); }
});
router.put('/:id', auth, async (req, res) => {
  try { res.json(await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (e) { res.status(400).json({ message: e.message }); }
});
router.delete('/:id', auth, async (req, res) => {
  try { await Testimonial.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (e) { res.status(500).json({ message: e.message }); }
});
module.exports = router;

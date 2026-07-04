const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try { res.json(await Certificate.find().sort({ issueDate: -1 })); }
  catch (e) { res.status(500).json({ message: e.message }); }
});
router.post('/', auth, async (req, res) => {
  try { const c = new Certificate(req.body); await c.save(); res.status(201).json(c); }
  catch (e) { res.status(400).json({ message: e.message }); }
});
router.put('/:id', auth, async (req, res) => {
  try { res.json(await Certificate.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (e) { res.status(400).json({ message: e.message }); }
});
router.delete('/:id', auth, async (req, res) => {
  try { await Certificate.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (e) { res.status(500).json({ message: e.message }); }
});
module.exports = router;

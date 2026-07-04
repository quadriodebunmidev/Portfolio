const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try { res.json(await Skill.find()); } catch (e) { res.status(500).json({ message: e.message }); }
});
router.post('/', auth, async (req, res) => {
  try {
    const skill = new Skill(req.body);
    await skill.save();
    res.status(201).json(skill);
  } catch (e) { res.status(400).json({ message: e.message }); }
});
router.put('/:id', auth, async (req, res) => {
  try { res.json(await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (e) { res.status(400).json({ message: e.message }); }
});
router.delete('/:id', auth, async (req, res) => {
  try { await Skill.findByIdAndDelete(req.params.id); res.json({ message: 'Skill deleted' }); }
  catch (e) { res.status(500).json({ message: e.message }); }
});
module.exports = router;

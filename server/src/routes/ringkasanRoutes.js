const express = require('express');
const router = express.Router();
const ringkasanController = require('../controllers/ringkasanController');

router.get('/', ringkasanController.getRingkasan);

module.exports = router;

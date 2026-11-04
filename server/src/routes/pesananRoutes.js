const express = require('express');
const router = express.Router();
const pesananController = require('../controllers/pesananController');

router.get('/', pesananController.getAllPesanan);
router.get('/:id', pesananController.getPesananById);
router.post('/', pesananController.createPesanan);
router.put('/:id', pesananController.updatePesanan);
router.patch('/:id', pesananController.updatePesanan);
router.delete('/:id', pesananController.deletePesanan);

module.exports = router;

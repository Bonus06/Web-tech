const express = require('express');
const checkoutController = require('../controllers/checkoutController');

const router = express.Router();

router.post('/', (req, res) => checkoutController.checkout(req, res));

module.exports = router;

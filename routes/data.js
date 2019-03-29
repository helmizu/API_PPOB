var express = require('express');
var router = express.Router();
var data = require('../models/data');

router.get('/tarif', data.getTarif);
router.post('/tarif', data.setTarif);
router.delete('/tarif', data.delTarif);

router.get('/penggunaan', data.getPenggunaan);
router.post('/penggunaan', data.setPenggunaan);
router.delete('/penggunaan', data.delPenggunaan);

router.get('/pembayaran', data.getPembayaran);
router.get('/pembayaran/unpaid', data.getPembayaranUnpaid);
router.get('/pembayaran/pending', data.getPembayaranPending);
router.get('/pembayaran/paid', data.getPembayaranPaid);
router.put('/pembayaran/verifikasi', data.verPembayaran);

module.exports = router;

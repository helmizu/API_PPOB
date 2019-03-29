var express = require('express');
var router = express.Router();
var db = require("../config").db

router.get('/', function(req, res, next) {
  var limit = req.query.limit || 10
  var offset = req.query.offset || 0
  if (req.query.limit) {
    db.query(`SELECT * FROM pelanggan JOIN tarif ON tarif.id_tarif = pelanggan.id_tarif ORDER BY pelanggan.nama ASC LIMIT ${limit} OFFSET ${offset}`,
    function (error, results, fields) {
      if (error) throw error;
      res.status(200).json(results)
    })
  } else {
    db.query(`SELECT * FROM pelanggan ORDER BY nama ASC`,
    function (error, results, fields) {
      if (error) throw error;
      res.status(200).json(results)
    }) 
  }
});

router.post('/', function(req, res, next) {
  var data = {
    nama : req.body.nama,
    no_meter : req.body.no_meter,
    alamat : req.body.alamat,
    id_tarif : req.body.id_tarif,
    username : req.body.username,
    password : req.body.password
  }
  
  db.query('INSERT INTO pelanggan SET ?', data,
  function(error, results, fields){
    if (error) throw error;
    res.status(201).json(results)
  })
});

router.put('/:id', function(req, res, next) {
  var data = {
    nama : req.body.nama,
    no_meter : req.body.no_meter,
    alamat : req.body.alamat,
    id_tarif : req.body.id_tarif,
    username : req.body.username,
    password : req.body.password
  }
  db.query(`UPDATE pelanggan 
  SET no_meter=${data.no_meter},nama='${data.nama}',alamat='${data.alamat}',id_tarif=${data.id_tarif},username='${data.username}',password='${data.password}' 
  WHERE id_pelanggan=${req.params.id}`,
  function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results)
  })
});

router.delete('/:id', function(req, res, next) {
  db.query(`DELETE FROM pelanggan WHERE id_pelanggan=${req.params.id}`,
  function (error, results, fields) {
    if (error) res.status(500).json(error);
    res.status(200).json(results)
  })
});

router.get('/:id', function(req, res, next) {
  db.query(`SELECT * FROM pelanggan WHERE id_pelanggan = ${req.params.id}`,
  function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results[0])
  }) 
});

// Auth
router.post('/login', function(req, res, next) {
  var data = {
    username : req.body.username,
    password : req.body.password
  }
  
  db.query(`SELECT id_pelanggan, no_meter, nama, alamat, id_tarif FROM pelanggan WHERE username = '${data.username}' AND password = '${data.password}' LIMIT 1,1`,
  function(error, results, fields){
    if (error) throw error;
    res.status(200).cookie('user', results[0], { expires: new Date(Date.now() + 900000), encode: String }).json(results[0])
  })
});

router.get('/logout', function(req, res, next) {
  res.status(200).clearCookie('user').json({msg : "user logout"})
})

module.exports = router;

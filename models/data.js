var db = require("../config").db

const data = {
    getTarif : (req, res) => {
        db.query(`SELECT * FROM tarif`,
        function (error, results, fields) {
            if (error) res.status(500).json(error);;
            res.status(200).json(results)
        })
    },
    
    setTarif : (req, res) => {
        var data = {
            daya : req.body.daya,
            harga : req.body.harga
        }
        db.query(`INSERT INTO tarif set ?`, data,
        function (error, results, fields) {
            if (error) res.status(500).json(error);;
            res.status(201).json(results)
        })        
    },
    
    delTarif : (req, res) => {
        var id = req.query.id;
        if(!id) return res.status(204).json({msg : "id tidak ditemukan"})
        db.query(`DELETE FROM tarif WHERE id_tarif = ${id}`, data,
        function (error, results, fields) {
            if (error) res.status(500).json(error);
            res.status(200).json(results)
        })      
    }, 
    
    //Tagihan include in Penggunaan
    getPenggunaan: (req, res) => {
        if (req.query.limit) {
            db.query(`  SELECT * FROM penggunaan 
                        JOIN pelanggan ON penggunaan.id_pelanggan = pelanggan.id_pelanggan
                        JOIN tagihan ON tagihan.id_penggunaan = penggunaan.id_penggunaan`, 
            function (error, results, fields) {
                if (error) res.status(500).json(error);
                res.status(200).json(results)
            })    
        } else {
            db.query(`SELECT * FROM penggunaan`, 
            function (error, results, fields) {
                if (error) res.status(500).json(error);
                res.status(200).json(results)
            })    
        }
        
    },
    
    setPenggunaan: (req, res) => {
        var data = {
            id_pelanggan : req.body.pelanggan,
            bulan : req.body.bulan,
            tahun : req.body.tahun,
            meter_awal : req.body.meter_awal,
            meter_akhir : req.body.meter_akhir
        }
        db.query('INSERT INTO penggunaan SET ?', data,
        function (error, results, fields) {
            if (error) res.status(500).json(error);
            db.query(`INSERT INTO tagihan SET ?`, {
                id_penggunaan : results.insertId,
                jumlah_meter : data.meter_akhir - data.meter_awal,
                status: 0 // 0 = unpaid, 1 = pending, 2 = paid
            },
            function (error2, results2, fields2) {
                if (error2) res.status(500).json(error2);
                res.status(201).json(results2)
            })
        })
    },
    
    delPenggunaan: (req, res) => {
        var id = req.query.id
        if (!id) return res.status(204).json({msg : "id tidak ditemukan"})
        db.query(`DELETE FROM penggunaan WHERE id_penggunaan = ${id}`,
        function (error, results, fields) {
            if (error) res.status(500).json(error);
            res.status(200).json(results)
        })
    },
    
    getPembayaran: (req, res) => {
        db.query(`SELECT tagihan.id_tagihan, nama, bulan, tahun, total_bayar-biaya_admin AS biaya_tagihan, biaya_admin, total_bayar, tanggal, status 
        FROM tagihan
        LEFT JOIN pembayaran ON pembayaran.id_tagihan = tagihan.id_tagihan
        JOIN penggunaan ON penggunaan.id_penggunaan = tagihan.id_penggunaan
        JOIN pelanggan ON penggunaan.id_pelanggan = pelanggan.id_pelanggan `,
        function (error, results, fields) {
            if (error) res.status(500).json(error)
            res.status(200).json(results)
        })
    },
    
    getPembayaranUnpaid: (req, res) => {
        if (!req.query.limit) {   
            db.query(`SELECT tagihan.id_tagihan, nama, bulan, tahun, total_bayar-biaya_admin AS biaya_tagihan, biaya_admin, total_bayar, tanggal, status 
            FROM tagihan
            LEFT JOIN pembayaran ON pembayaran.id_tagihan = tagihan.id_tagihan
            JOIN penggunaan ON penggunaan.id_penggunaan = tagihan.id_penggunaan
            JOIN pelanggan ON penggunaan.id_pelanggan = pelanggan.id_pelanggan 
            WHERE status = 0`,
            function (error, results, fields) {
                if (error) res.status(500).json(error)
                res.status(200).json(results)
            })
        } else {
            db.query(`SELECT tagihan.id_tagihan, nama, bulan, tahun, total_bayar-biaya_admin AS biaya_tagihan, biaya_admin, total_bayar, tanggal, status 
            FROM tagihan
            LEFT JOIN pembayaran ON pembayaran.id_tagihan = tagihan.id_tagihan
            JOIN penggunaan ON penggunaan.id_penggunaan = tagihan.id_penggunaan
            JOIN pelanggan ON penggunaan.id_pelanggan = pelanggan.id_pelanggan 
            WHERE status = 0 LIMIT ${req.query.limit} OFFSET ${req.query.offset}`,
            function (error, results, fields) {
                if (error) res.status(500).json(error)
                res.status(200).json(results)
            })  
        }
    },
    
    getPembayaranPending: (req, res) => {
        if (!req.query.limit) {   
            db.query(`SELECT tagihan.id_tagihan, nama, bulan, tahun, total_bayar-biaya_admin AS biaya_tagihan, biaya_admin, total_bayar, tanggal, status 
            FROM tagihan
            LEFT JOIN pembayaran ON pembayaran.id_tagihan = tagihan.id_tagihan
            JOIN penggunaan ON penggunaan.id_penggunaan = tagihan.id_penggunaan
            JOIN pelanggan ON penggunaan.id_pelanggan = pelanggan.id_pelanggan 
            WHERE status = 1`,
            function (error, results, fields) {
                if (error) res.status(500).json(error)
                res.status(200).json(results)
            })
        } else {
            db.query(`SELECT tagihan.id_tagihan, nama, bulan, tahun, total_bayar-biaya_admin AS biaya_tagihan, biaya_admin, total_bayar, tanggal, status 
            FROM tagihan
            LEFT JOIN pembayaran ON pembayaran.id_tagihan = tagihan.id_tagihan
            JOIN penggunaan ON penggunaan.id_penggunaan = tagihan.id_penggunaan
            JOIN pelanggan ON penggunaan.id_pelanggan = pelanggan.id_pelanggan 
            WHERE status = 1 LIMIT ${req.query.limit} OFFSET ${req.query.offset}`,
            function (error, results, fields) {
                if (error) res.status(500).json(error)
                res.status(200).json(results)
            })  
        }
    },
    
    getPembayaranPaid: (req, res) => {
        if (!req.query.limit) {   
            db.query(`SELECT tagihan.id_tagihan, nama, bulan, tahun, total_bayar-biaya_admin AS biaya_tagihan, biaya_admin, total_bayar, tanggal, status 
            FROM tagihan
            LEFT JOIN pembayaran ON pembayaran.id_tagihan = tagihan.id_tagihan
            JOIN penggunaan ON penggunaan.id_penggunaan = tagihan.id_penggunaan
            JOIN pelanggan ON penggunaan.id_pelanggan = pelanggan.id_pelanggan 
            WHERE status = 2`,
            function (error, results, fields) {
                if (error) res.status(500).json(error)
                res.status(200).json(results)
            })
        } else {
            db.query(`SELECT tagihan.id_tagihan, nama, bulan, tahun, total_bayar-biaya_admin AS biaya_tagihan, biaya_admin, total_bayar, tanggal, status 
            FROM tagihan
            LEFT JOIN pembayaran ON pembayaran.id_tagihan = tagihan.id_tagihan
            JOIN penggunaan ON penggunaan.id_penggunaan = tagihan.id_penggunaan
            JOIN pelanggan ON penggunaan.id_pelanggan = pelanggan.id_pelanggan 
            WHERE status = 2 LIMIT ${req.query.limit} OFFSET ${req.query.offset}`,
            function (error, results, fields) {
                if (error) res.status(500).json(error)
                res.status(200).json(results)
            })  
        }
    },
    
    verPembayaran : (req, res) => {
        var id = req.query.id
        if (!id) return res.status(204).json({msg : "id tidak ditemukan"})
        db.query(`UPDATE tagihan SET ? WHERE id_tagihan=${id}`, {status : 2},
        function (error, results, fields) {
            if (error) res.status(500).json(error)
            res.status(200).json(results)
        })
    },
    
    setPembayaran: (req, res) => {
        
    }
    
}

module.exports = data
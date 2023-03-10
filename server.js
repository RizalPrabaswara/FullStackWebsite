const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false";
const client = new MongoClient(uri, { useNewUrlParser: true });

//Koneksi Database & Port
client.connect(err => {
	dbproduk = client.db("UAS-PPFS").collection("produk");
	dbdaftarharga = client.db("UAS-PPFS").collection("daftar-harga");
	dbtentangkami = client.db("UAS-PPFS").collection("tentang-kami");
	dbsupplier = client.db("UAS-PPFS").collection("supplier");
	app.listen(8090, function(){
		console.log("Berhasil Terhubung Port 8090!");
	});
});

//Load Folder Gambar
app.use(express.static("gambar"));

//Load Tampilan Beranda
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine','ejs');
app.get('/',(req, res) => {
	dbtentangkami.find().toArray((err, results) => {
		if (err) return console.log("Error : " + err);
		res.render('beranda.ejs', { cds: results });
	});
});

//Load Tampilan Tambah Produk
app.get('/tambah-produk', (req, res) => {
	res.render('tambah-produk.ejs')
});

//Fungsi Tambah Produk
app.post('/tambah-produk', (req, res) => {
	dbproduk.insertOne(req.body, (err, result) => {
		if (err) return console.log("Error : " + err);
		console.log("Berhasil Tambah Produk!");
		res.redirect('/produk');
	});
});

//Load Tampilan Supplier
app.get('/supplier', (req, res) => {
	dbsupplier.find().toArray((err, results) => {
		if (err) return console.log("Error : " + err);
		res.render('supplier.ejs', { cds: results });
	});
});

//Load Tampilan Tambah Supplier
app.get('/tambah-supplier', (req, res) => {
	res.render('tambah-supplier.ejs')
});

//Fungsi Tambah Supplier
app.post('/tambah-supplier', (req, res) => {
	dbsupplier.insertOne(req.body, (err, result) => {
		if (err) return console.log("Error : " + err);
		console.log("Berhasil Tambah Supplier!");
		res.redirect('/supplier');
	});
});

//Load Tampilan Data Supplier
app.get('/data-supplier', (req, res) => {
	dbsupplier.find().toArray((err, results) => {
		if (err) return console.log("Error : " + err);
		res.render('data-supplier.ejs', { cds: results });
	});
});

//Fungsi Edit Supplier
var ObjectId = require('mongodb').ObjectId;
app.route('/edit-supplier/:id').get((req, res) => {
	var id = req.params.id;
	dbsupplier.find(ObjectId(id)).toArray((err, result) => {
		if (err) return console.log("Error : " + err);
		res.render('edit-supplier.ejs', { cds: result });
	});
}).post((req, res) => {
	var id = req.params.id;
	var namasupplier = req.body.namasupplier;
	var alamat = req.body.alamat;
	var notelepon = req.body.notelepon;
	dbsupplier.updateOne({_id: ObjectId(id)}, {
		$set: {
			namasupplier: namasupplier,
			alamat: alamat,
			notelepon: notelepon
		}
		}, (err, results) => {
		if (err) return res.send(err);
		res.redirect('/data-supplier');
		console.log('Update Informasi Berhasil!');
	})
});

//Fungsi Hapus Supplier
app.route('/hapus-supplier/:id').get((req, res) => {
	var id = req.params.id;
	dbsupplier.deleteOne({_id: ObjectId(id)}, (err, result) => {
		if (err) return res.send(500, err);
		console.log("Hapus Supplier Berhasil!");
		res.redirect('/data-supplier');
	});
});

//Load Tampilan Data Produk
app.get('/produk', (req, res) => {
	dbproduk.find().toArray((err, results) => {
		if (err) return console.log("Error : " + err);
		res.render('produk.ejs', { cds: results });
	});
});

//Load Tampilan Daftar Harga Produk
app.get('/daftar-harga', (req, res) => {
	dbproduk.find().toArray((err, results) => {
		if (err) return console.log("Error : " + err);
		res.render('daftar-harga.ejs', { cds: results });
	});
});

//Load Tampilan Tambah Informasi
app.get('/tambah-informasi', (req, res) => {
	res.render('tambah-informasi.ejs')
});

//Fungsi Tambah Informasi
app.post('/tambah-informasi', (req, res) => {
	dbtentangkami.insertOne(req.body, (err, results) => {
		if (err) return console.log("Error : " + err);
		console.log("Berhasil Tambah Informasi!");
		res.redirect('/data-informasi');
	});
});

//Load Tampilan Tentang Kami
app.get('/tentang-kami',(req, res) => {
	dbtentangkami.find().toArray((err, results) => {
		if (err) return console.log("Error : " + err);
		res.render('tentang-kami.ejs', { cds: results });
	});
});

//Load Tampilan Menu Admin
app.get('/admin', (req, res) => {
	dbproduk.find().toArray((err, results) => {
		if (err) return console.log("Error : " + err);
		res.render('admin.ejs', { cds: results });
	});
});

//Load Tampilan Data Produk
app.get('/data-produk', (req, res) => {
	dbproduk.find().toArray((err, results) => {
		if (err) return console.log("Error : " + err);
		res.render('data-produk.ejs', { cds: results });
	});
});

//Fungsi Edit Produk
var ObjectId = require('mongodb').ObjectId;
app.route('/edit-produk/:id').get((req, res) => {
	var id = req.params.id;
	dbproduk.find(ObjectId(id)).toArray((err, result) => {
		if (err) return console.log("Error : " + err);
		res.render('edit-produk.ejs', { cds: result });
	});
}).post((req, res) => {
	var id = req.params.id;
	var namaproduk = req.body.namaproduk;
	var fotoproduk = req.body.fotoproduk;
	var hargaproduk = req.body.hargaproduk;
	dbproduk.updateOne({_id: ObjectId(id)}, {
		$set: {
			namaproduk: namaproduk,
			fotoproduk: fotoproduk,
			hargaproduk: hargaproduk
		}
		}, (err, results) => {
		if (err) return res.send(err);
		res.redirect('/data-produk');
		console.log('Update Informasi Berhasil!');
	})
});

//Fungsi Hapus Produk
app.route('/hapus-produk/:id').get((req, res) => {
	var id = req.params.id;
	dbproduk.deleteOne({_id: ObjectId(id)}, (err, result) => {
		if (err) return res.send(500, err);
		console.log("Hapus Produk Berhasil!");
		res.redirect('/data-produk');
	});
});

//Load Tampilan Data Informasi Toko
app.get('/data-informasi', (req, res) => {
	dbtentangkami.find().toArray((err, results) => {
		if (err) return console.log("Error : " + err);
		res.render('data-informasi.ejs', { cds: results });
	});
});

//Fungsi Edit Informasi Toko
var ObjectId = require('mongodb').ObjectId;
app.route('/edit-toko/:id').get((req, res) => {
	var id = req.params.id;
	dbtentangkami.find(ObjectId(id)).toArray((err, result) => {
		if (err) return console.log("Error : " + err);
		res.render('edit-informasi.ejs', { cds: result });
	});
}).post((req, res) => {
	var id = req.params.id;
	var namatoko = req.body.namatoko;
	var deskripsitoko = req.body.deskripsitoko;
	var alamattoko = req.body.alamattoko;
	var telepontoko = req.body.telepontoko;
	dbtentangkami.updateOne({_id: ObjectId(id)}, {
		$set: {
			namatoko: namatoko,
			deskripsitoko: deskripsitoko,
			alamattoko: alamattoko,
			telepontoko: telepontoko
		}
		}, (err, results) => {
		if (err) return res.send(err);
		res.redirect('/data-informasi');
		console.log('Update Informasi Berhasil!');
	})
});

//Fungsi Hapus Informasi Toko
app.route('/hapus-toko/:id').get((req, res) => {
	var id = req.params.id;
	dbtentangkami.deleteOne({_id: ObjectId(id)}, (err, result) => {
		if (err) return res.send(500, err);
		console.log("Hapus Informasi Berhasil!");
		res.redirect('/data-informasi');
	});
});

//Fungsi Beli Produk
var ObjectId = require('mongodb').ObjectId;
app.route('/beli/:id').get((req, res) => {
	var id = req.params.id;
	dbproduk.find(ObjectId(id)).toArray((err, result) => {
		if (err) return console.log("Error : " + err);
		res.render('beli.ejs', { cds: result });
	});
});

//Fungsi Wishlist Produk
var ObjectId = require('mongodb').ObjectId;
app.route('/wishlist/:id').get((req, res) => {
	var id = req.params.id;
	dbproduk.find(ObjectId(id)).toArray((err, result) => {
		if (err) return console.log("Error : " + err);
		res.render('beli.ejs', { cds: result });
	});
});
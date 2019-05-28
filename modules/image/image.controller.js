(function () {
    'use strict';
    var express = require('express');
    var router = express.Router();

    var mongoose = require('mongoose');

    var multer = require('multer');
    var GridFsStorage = require('multer-gridfs-storage');
    var crypto = require('crypto');
    var path = require('path');

    // instance of ImageMiddleware to handle requests
    var ImageMiddleware = require('./image.module')().ImageMiddleware;

    var storage = new GridFsStorage({
        db: mongoose.connection,        
        file: (req, file) => {
            return new Promise((resolve, reject) => {
                if(file.mimetype.includes('image/')){
                    crypto.randomBytes(16, (err, buf) => {
                        if (err) {
                            return reject(err);
                        }
                        const filename = buf.toString('hex') + path.extname(file.originalname);    
    
                        const fileInfo = {
                            filename: filename,
                            bucketName: 'genforeningen'
                        };
                        resolve(fileInfo);
                    });
                } else {
                    reject('Mime-type not allowed');
                }                
            });
        }
    });
    var upload = multer({ storage });

    // GET image by id from server
    router.get('/:id',
        function (req, res, next) {
            try {
                let objId = mongoose.Types.ObjectId(req.params.id);
                next();
            } catch (err) {
                res.status(400).send();
            }
        },
        ImageMiddleware.getFileData,
        function (req, res) {
            if(req.response){
                let gridFSbucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'genforeningen' });
                if (gridFSbucket) {
                    res.set('Content-Type', req.response.contentType);
                    res.set(
                        'Content-Disposition',
                        'inline; filename="' + req.response.filename + '"');
    
                    let stream = gridFSbucket.openDownloadStream(mongoose.Types.ObjectId(req.params.id));
                    stream.on('data', (chunk) => {
                        res.write(chunk);
                    });
                    stream.on('error', (err) => {
                        res.status(404).send();
                    });
                    stream.on('end', () => {
                        res.end();
                    });
                } else {
                    console.log("Sorry No Grid FS Bucket");
                    res.status(500).send("Sorry No Grid FS Bucket");
                }
            } else {
                res.status(404).send();
            }                    
        });

    // POST image to server
    router.post('/', upload.single('file'), (req, res) => {
        res.json({ file: req.file });
    });

    module.exports = router;
})();

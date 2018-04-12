const mongoose = require('mongoose');
var multer = require('multer');
var mkdirp = require('mkdirp');
const fs = require('fs');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dir = process.cwd()+'/client/public/images/'+req.params.id
    if(process.env.NODE_ENV === 'production'){
      dir = process.cwd()+'/client/images/'+req.params.id
    }
    // mkdirp(dir, err => cb(null, dir))
    var result = mkdirp(dir, function(err){console.error(err);})
    console.log('upload images in folder = ' + dir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload = multer( { storage: storage } );

const Project = mongoose.model('projects');

module.exports = app => {
  app.post( '/api/image/:id', upload.array('file', 12), async (req, res) => {
    console.log('upload image!!');
    res.send(req.body)
  });

  app.put( '/api/image/:id', (req, res) => {
    const { image, uniqID, name } = req.body;
    if(req.params.id !== 'new'){
      const idNew = mongoose.Types.ObjectId(req.params.id);
      Project.findByIdAndUpdate(idNew, { image }, (err, item) => {
        if(err) console.error(err)
        res.send(item)
      })
    }
    let new_name = decodeURI(name)
    let deleteFile = `client/public/images/${uniqID}/${new_name}`
    if(process.env.NODE_ENV === 'production') deleteFile = `client/images/${uniqID}/${new_name}`
    fs.unlink(deleteFile, (err) => {
      if (err) throw err;
      console.log(deleteFile + ' was deleted');
    });
    if(req.params.id == 'new'){
      Project.find({}, (err, data) => {
        res.send(data)
      });
    }
  });
}

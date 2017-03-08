const s3 = require('./s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const uuid = require('uuid');

module.exports = multer({
  storage: multerS3({
    s3,
    bucket: 'wdi-london-25',
    key(req, file, next) { //key means the file. v4 below creates random string
      const ext = file.mimetype.replace('image/', '');
      const filename = `${uuid.v4()}.${ext}`;
      next(null, filename);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE //uses one that file is
  }),
  fileFilter(req, file, next) {
    const whitelist = ['image/png', 'image/jpeg', 'image/gif'];
    next(null, whitelist.includes(file.mimetype)); //passes in error then boolean value that allows types of image only
  },
  limits: {
    fileSize: 2024 * 2024 * 2
  }
});

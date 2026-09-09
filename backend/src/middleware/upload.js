const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null, 'uploads/');
    },
    filename: function (req,file,cb){
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file,cb) => {
    if(file.mimetype === 'text/csv' || path.extname(file.originalname).toLowerCase() === '.csv'){
        cb(null, true);
    }else{
        cb(new Error('Only csv files are allowed'), false);
    }
};

 const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
 });

 module.exports = upload;
import multer from 'multer';
import path from 'path';

// Definição do armazenamento de imagens
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = '';

    if (req.baseUrl.includes('users')) {
      folder = 'users';
    } else if (req.baseUrl.includes('pets')) {
      folder = 'pets';
    }

    cb(null, path.join('public', 'images', folder));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Definição do filtro de arquivos
const imageUpload = multer({
  storage: imageStorage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      return cb(new Error('Por favor, envie apenas jpg ou png'));
    }
    cb(null, true);
  },
});

export default imageUpload;

// const { Storage } = require('@google-cloud/storage');
// const path = require('path');
// const multer = require('multer');
// const { v4: uuidv4 } = require('uuid');

// const keyFilename = path.join(__dirname, '../uploads/dmf-orissa-f9210fba23a5.json');
// const storage = new Storage({
//   keyFilename,
//   projectId: 'dmf-orissa',
// });

// const bucketName = 'dmf-orrisa';
// const bucket = storage.bucket(bucketName);

// const storageMulter = multer.memoryStorage();

// const upload = multer({
//   storage: storageMulter,
//   limits: { fileSize: 15 * 1024 * 1024 },
// });

// const uploadFilesMiddleware = async (req, res, next) => {
//   if (!req.files) {
//     return res.status(400).send('No files uploaded');
//   }

//   try {
//     const fileUrls = await Promise.all(
//       req.files.map(async (file) => {
//         const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`;
//         const blob = bucket.file(uniqueFileName);
//         const blobStream = blob.createWriteStream({
//           resumable: false,
//           metadata: {
//             contentType: file.mimetype,
//           },
//         });

//         return new Promise((resolve, reject) => {
//           blobStream.on('error', (error) => {
//             reject('Error uploading file');
//           });

//           blobStream.on('finish', () => {
//             resolve(`https://console.cloud.google.com/${bucket.name}/${uniqueFileName}`);
//           });

//           blobStream.end(file.buffer);
//         });
//       })
//     );

//     req.fileUrls = fileUrls;
//     next();
//   } catch (error) {
//     res.status(500).send('Error uploading files');
//   }
// };

// module.exports = {
//   bucket,
//   upload,
//   uploadFilesMiddleware,
// };
// https://storage.googleapis.com

const { Storage } = require('@google-cloud/storage');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const keyFilename = path.join(__dirname, '../uploads/dmf-orissa-f9210fba23a5.json');
const storage = new Storage({
  keyFilename,
  projectId: 'dmf-orissa',
});

const bucketName = 'dmf-orrisa';
const bucket = storage.bucket(bucketName);

const storageMulter = multer.memoryStorage();

const upload = multer({
  storage: storageMulter,
  limits: { fileSize: 15 * 1024 * 1024 },
});

const uploadFilesMiddleware = async (req, res, next) => {
  if (!req.files) {
    return res.status(400).send('No files uploaded');
  }

  try {
    const fileUrls = await Promise.all(
      req.files.map(async (file) => {
        const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`;
        const blob = bucket.file(uniqueFileName);
        const blobStream = blob.createWriteStream({
          resumable: false,
          metadata: {
            contentType: file.mimetype,
          },
        });

        return new Promise((resolve, reject) => {
          blobStream.on('error', () => {
            reject(new Error('Error uploading file'));
          });

          blobStream.on('finish', () => {
            resolve(`https://console.cloud.google.com/storage/browser/${bucket.name}/${uniqueFileName}`);
          });

          blobStream.end(file.buffer);
        });
      })
    );

    // Extract bucket name and image name from URLs
    const updateData = fileUrls.map(url => {
      const match = url.match(/https:\/\/console\.cloud\.google\.com\/storage\/browser\/([^\/]+)\/([^\/?]+)/);
      if (match) {
        const bucketName = match[1];
        const imageName = match[2];
        return `${bucketName}/${imageName}`
      } else {
        // Handle the case where the URL does not match the expected format
        throw new Error(`URL does not match expected format: ${url}`);
      }
    });

    req.updateData = updateData;  // Add the extracted data to the request object
    next();
  } catch (error) {
    res.status(500).send('Error uploading files');
  }
};

module.exports = {
  bucket,
  upload,
  uploadFilesMiddleware,
};

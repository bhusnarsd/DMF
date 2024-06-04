// /**
//  * TODO(developer): Uncomment the following lines before running the sample.
//  */
// // The ID of your GCS bucket
// const bucketName = 'dmf-orrisa';

// // The ID of the first GCS file to download
// const firstFilePath = '/home/ubuntu/DMF/src/school.csv';

// // The ID of the second GCS file to download
// const secondFilePath = '/home/ubuntu/DMF/src/students.csv';

// // Imports the Google Cloud client library
// const {Storage, TransferManager} = require('@google-cloud/storage');

// // Creates a client
// const storage = new Storage();

// // Creates a transfer manager client
// const transferManager = new TransferManager(storage.bucket(bucketName));

// async function uploadManyFilesWithTransferManager() {
//   // Uploads the files
//   await transferManager.uploadManyFiles([firstFilePath, secondFilePath]);

//   for (const filePath of [firstFilePath, secondFilePath]) {
//     console.log(`${filePath} uploaded to ${bucketName}.`);
//   }
// }

// module.exports =  uploadManyFilesWithTransferManager


// config/gcpStorage.js
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
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files uploaded');
  }

  try {
    const fileUrls = await Promise.all(req.files.map(async (file) => {
      const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`;
      const blob = bucket.file(uniqueFileName);
      const blobStream = blob.createWriteStream({
        resumable: false,
        metadata: {
          contentType: file.mimetype,
        },
      });

      await new Promise((resolve, reject) => {
        blobStream.on('error', reject);
        blobStream.on('finish', resolve);
        blobStream.end(file.buffer);
      });

      await bucket.file(uniqueFileName).makePublic();
      return `https://console.cloud.google.com/storage/browser/${bucket.name}/${uniqueFileName}`;
    }));

    req.fileUrls = fileUrls;
    next();
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).send('Error uploading files');
  }
};

module.exports = {
  bucket,
  upload,
  uploadFilesMiddleware,
};

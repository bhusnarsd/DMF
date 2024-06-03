// /**
//  * TODO(developer): Uncomment the following lines before running the sample.
//  */
// // The ID of your GCS bucket
// // const bucketName = 'your-unique-bucket-name';

// // The ID of the first GCS file to download
// // const firstFilePath = 'your-first-file-name';

// // The ID of the second GCS file to download
// // const secondFilePath = 'your-second-file-name';

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

// uploadManyFilesWithTransferManager().catch(console.error);

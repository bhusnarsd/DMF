const admin = require('firebase-admin');

// Replace with the path to your service account key file
const serviceAccount = require('../uploads/dmf-sundargarh-firebase-adminsdk-47vh2-af39fa516a.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;

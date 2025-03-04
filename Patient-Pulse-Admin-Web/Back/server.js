const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
 

const app = express();
app.use(cors());
dotenv.config();
app.use(bodyParser.json()); // To parse JSON data from requests

// Connect to MongoDB
 mongoose.connect('mongodb+srv://ppUser:p123@avishkacluster.9ch2v.mongodb.net/patient-pulse?retryWrites=true&w=majority')
   .then(() => console.log('Connected to MongoDB'))
   .catch(err => console.log(err));


// Import Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Define the root route
app.get('/', (req, res) => {
  res.send('Welcome to the Patient Pulse API');
});

const { initializeApp } = require("firebase/app");
const { getDatabase } = require("firebase/database");
const { ref, set, onValue, update, get } = require("firebase/database");

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const appDb = initializeApp(firebaseConfig);

const database = getDatabase(appDb);

app.post("/addFingerprintData", (req, res) => {
  const { DeviceMode, FingerPrintCount, GetUser } = req.body;

  // Set the data structure in Firebase
  update(ref(database, "/"), {
    DeviceMode,
    FingerPrintCount,
    GetUser,
  })
    .then(() => {
      res.status(200).send("Data added successfully!");
    })
    .catch((error) => {
      res.status(500).send("Error adding data: " + error.message);
    });
});

app.post("/resetFingerprintData", async (req, res) => {
  try {
    // Set references to the specific fields in the database
    const catchFingerPrintIDRef = ref(database, "/catchFingerPrintID");
    const catchUserIdRef = ref(database, "/catchUserId");

    // Use set() to directly set the values
    await set(catchFingerPrintIDRef, 0); // Set catchFingerPrintID to 0
    await set(catchUserIdRef, "0000");   // Set catchUserId to "0000"

    // Send a success response
    res.status(200).send({
      message: "Fingerprint data reset successfully!",
    });
  } catch (error) {
    // Handle any errors
    res.status(500).send("Error resetting fingerprint data: " + error.message);
  }
});

app.get("/getFingerprintData", (req, res) => {
  try {
    const starCountRef = ref(database, "/catchUserId");

    onValue(
      starCountRef,
      (snapshot) => {
        const data = snapshot.val();
        res.status(200).send({
          message: "Data retrieved successfully!",
          data: data,
        });
      },
      {
        onlyOnce: true,
      }
    );
  } catch (error) {
    res.status(500).send("Error getting data: " + error.message);
  }
});

app.get("/checkDeviceMode", (req, res) => {
  const deviceModeRef = ref(database, "/DeviceMode");

  get(deviceModeRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const deviceMode = snapshot.val();
        if (deviceMode === "auth") {
          res.status(200).json({ status: true });
        } else {
          res.status(200).json({ status: false });
        }
      } else {
        res.status(404).json({ message: "DeviceMode not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "Error checking DeviceMode: " + error.message });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

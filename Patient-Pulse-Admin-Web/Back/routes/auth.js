const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Patient = require('../models/Patients');
const Appointment = require('../models/Appointments'); // Ensure the path is correct
const Admin = require('../models/Admin'); // Ensure the path is correct
const nodemailer = require('nodemailer');// Import nodemailer
require('dotenv').config();
 

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY; // Use environment variables for secrets

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service
  auth: {
    user: process.env.GMAIL_USER, // Set in .env file
    pass: process.env.GMAIL_PASS, // Set in .env file
  },
});

const sendEmail = (to, subject, html) => {
  const mailOptions = {
    from: `"Team Patient Pulse" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// Helper function to send email notifications
const sendLoginEmail = (email, name) => {
  const mailOptions = {
    from: `"Team Patient Pulse" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Successful Login Alert',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4CAF50;">Hello ${name},</h2>
        <p>We noticed a successful login to your account just now. If this was you, no further action is required.</p>
        <p>If this wasn't you, <strong>please secure your account immediately</strong> by changing your password and reviewing any suspicious activity.</p>
        <a href="${process.env.BASE_URL}/reset-password" 
           style="background-color: #F44336; color: white; text-decoration: none; padding: 10px 20px; 
           border-radius: 5px; display: inline-block; margin: 10px 0;">
          Secure My Account
        </a>
        <p>If you need further assistance, feel free to contact our support team.</p>
        <p>Stay safe,<br>Team Patient Pulse</p>
        <hr style="border: none; border-top: 1px solid #ccc;">
        <footer style="font-size: 12px; color: #888;">
          <p>This is an automated message. Please do not reply to this email.</p>
        </footer>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending login email:', error);
    } else {
      console.log('Login email sent:', info.response);
    }
  });
};




// Route to count total physical appointments
router.get('/appointments/physical-count', async (req, res) => {
  try {
    const physicalAppointmentCount = await Appointment.countDocuments({ appointmentType: 'physical' });
    res.status(200).json({ count: physicalAppointmentCount });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching physical appointments count' });
  }
});
router.get('/appointments/remote-count', async (req, res) => {
  try {
    const remoteAppointmentCount = await Appointment.countDocuments({ appointmentType: 'remote' });
    res.status(200).json({ count: remoteAppointmentCount });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching remote appointments count' });
  }
});

router.get('/total-patients', async (req, res) => {
  try {
    const patientCount = await Patient.countDocuments();
    res.status(200).json({ count: patientCount });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching patient count' });
  }
});



// ** Patient Signup Route ** //
router.post('/signup', async (req, res) => {
  const { name, dob, gender, bloodGroup, number, email, password } = req.body;

  try {
    let patient = await Patient.findOne({ email });
    if (patient) return res.status(400).send('Patient already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    // Find the last user and extract the latest user id
    const lastPatient = await Patient.findOne().sort({ createdAt: -1 });
    let newUserId = 'U001'; // Default for the first user

    if (lastPatient && lastPatient.userId) {
      const lastUserId = lastPatient.userId; // e.g., 'U001'
      const lastUserNumber = parseInt(lastUserId.substring(1)); // Extract number part (001)
      const newUserNumber = lastUserNumber + 1; // Increment by 1
      newUserId = `U${newUserNumber.toString().padStart(3, '0')}`; // e.g., 'U002'
    }

    patient = new Patient({
      name,
      dob,
      gender,
      bloodGroup,
      number,
      email,
      password: hashedPassword,
      userId: newUserId, // Add the userId to the patient document
      isVerified: false,
    });

    await patient.save();

    // Generate email verification token
    const verificationToken = jwt.sign(
      { id: patient._id, email: patient.email },
      SECRET_KEY,
      { expiresIn: '1h' }
    );
    const verificationUrl = `https://new-web-pp.onrender.com/api/auth/verify-email?token=${verificationToken}`;

    // Email content with professional HTML format
    const mailOptions = {
      from: `"Team Patient Pulse" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Confirm Your Email Address',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #4CAF50;">Welcome to Patient Pulse, ${name}!</h2>
          <p>Thank you for signing up. Please confirm your email address to activate your account:</p>
          <a href="${verificationUrl}" 
             style="background-color: #4CAF50; color: white; text-decoration: none; padding: 10px 20px; 
             border-radius: 5px; display: inline-block; margin: 10px 0;">
            Verify Email
          </a>
          <p>If you didn’t create this account, you can safely ignore this email.</p>
          <p>Best regards,<br>Team Patient Pulse</p>
          <hr style="border: none; border-top: 1px solid #ccc;">
          <footer style="font-size: 12px; color: #888;">
            <p>This is an automated message, please do not reply to this email.</p>
          </footer>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending verification email:', err);
        return res.status(500).send('Error sending verification email');
      }
      console.log('Verification email sent:', info.response);
      res.status(201).send('Account created successfully. Please verify your email.');
    });

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});



// ** Email Verification Route ** //
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    let patient = await Patient.findById(decoded.id);
    if (!patient) return res.status(400).send('Invalid token');

    patient.isVerified = true;
    await patient.save();

    res.send('Email verified successfully. You can now log in.');
  } catch (error) {
    res.status(400).send('Invalid or expired token');
  }
});


  // Create a default admin user
  async function createDefaultAdmin() {
    const adminExists = await Admin.findOne({ username: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = new Admin({ username: 'admin', password: hashedPassword });
      await admin.save();
      console.log('Default admin created: admin/admin123');
    }
  }
  
  createDefaultAdmin();


router.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });

  if (!admin) {
    return res.status(400).send({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(400).send({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: admin._id }, SECRET_KEY, { expiresIn: '1h' });
  res.send({ token });
});

// Middleware to authenticate JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send({ message: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).send({ message: 'Invalid token' });
  }
}


router.get('/patients', authenticateToken, async (req, res) => {
  const patients = await Patient.find();
  res.send(patients);
});


// ** Patient Profile Route ** //
// Route to get patient profile by userId
router.get('/profile/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const patient = await Patient.findOne({ userId }); // Find by custom userId
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    
    res.json(patient);
  } catch (error) {
    console.error('Error fetching patient profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Route to get count of physical appointments by userId// Route to count physical appointments
router.get('/user/:userId/physicalCount', async (req, res) => {
  const { userId } = req.params;

  try {
    const patient = await Patient.findOne({ userId }); // Find by custom userId
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const physicalCount = await Appointment.countDocuments({ 
      patientName: patient.name, // Use the patientName from the retrieved patient document
      appointmentType: 'physical' // Filter for physical appointments only
    });

    res.status(200).json({ count: physicalCount });
  } catch (error) {
    console.error('Error fetching physical appointments:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to count remote appointments
router.get('/user/:userId/remoteCount', async (req, res) => {
  const { userId } = req.params;

  try {
    const patient = await Patient.findOne({ userId }); // Find by custom userId
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const remoteCount = await Appointment.countDocuments({ 
      patientName: patient.name, // Use the patientName from the retrieved patient document
      appointmentType: 'remote' // Filter for remote appointments only
    });

    res.status(200).json({ count: remoteCount });
  } catch (error) {
    console.error('Error fetching remote appointments:', error);
    res.status(500).json({ error: 'Server error' });
  }
});




// Get all patients
router.get('/patients',authenticateToken, async (req, res) => {
  try {
      const patients = await Patient.find();
      res.json(patients);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// Search patients by email
router.get('/patients/search', authenticateToken, async (req, res) => {
  try {
      const email = req.query.email;
      if (!email) {
          return res.status(400).json({ message: 'Email query parameter is required' });
      }

      // Find the patient by email
      const patients = await Patient.find({ email: { $regex: email, $options: 'i' } }); // Case-insensitive search

      if (patients.length === 0) {
          return res.status(404).json({ message: 'No patients found' });
      }

      res.json(patients);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});


//contact us form
router.post('/contact', async (req, res) => {
  const { user_name, user_email, user_subject, user_phone, user_message } = req.body;

  try {
    // Compose email
    const mailOptions = {
      from: user_email,
      to: `"Team Patient Pulse Contact" <${process.env.GMAIL_USER}>`, // Send to your preferred email address
      subject: user_subject || 'New Contact Form Submission from Patient Pulse',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2 style="color: #4CAF50;">New Contact Form Submission</h2>
          <p>Dear Team,</p>
          <p>We have received a new contact form submission. Below are the details:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;"><strong>Name:</strong></td>
              <td style="border: 1px solid #ddd; padding: 8px;">${user_name}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;"><strong>Email:</strong></td>
              <td style="border: 1px solid #ddd; padding: 8px;">${user_email}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;"><strong>Phone:</strong></td>
              <td style="border: 1px solid #ddd; padding: 8px;">${user_phone}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;"><strong>Message:</strong></td>
              <td style="border: 1px solid #ddd; padding: 8px;">${user_message}</td>
            </tr>
          </table>
          <p>Thank you,</p>
          <p><strong>Team Patient Pulse</strong></p>
          <hr />
          <footer style="font-size: 12px; color: #555;">
            This message was sent from the Patient Pulse website. If you did not submit this form, please disregard this email.
          </footer>
        </div>
      `,
    };
    

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending contact form email:', error);
        return res.status(500).json({ error: 'Error sending email' });
      }
      console.log('Contact form email sent:', info.response);
      res.status(200).json({ message: 'Email sent successfully' });
    });

  } catch (error) {
    console.error('Error handling contact form submission:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/appointments', authenticateToken, async (req, res) => {
  try {
    const { date, time, appointmentType, patientId, patientName } = req.body;

    const existingAppointment = await Appointment.findOne({ date, time, patientId });
    if (existingAppointment) {
      return res.status(400).send('Time slot already booked for this patient.');
    }

    const appointment = new Appointment({
      date,
      time,
      appointmentType,
      patientId,
      patientName,
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating appointment');
  }
});


// Update Appointment
router.put('/appointments/:id', authenticateToken, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Error updating appointment' });
  }
});

// Delete an appointment
router.delete('/appointments/:id', authenticateToken, async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting appointment' });
  }
});

//Get All appointments
router.get("/appointments/all", authenticateToken, async (req, res) => {
  const appointments = await Appointment.find();
  res.send(appointments);
});


// Get All Appointments for a specific date (for checking availability)
router.get('/appointments', authenticateToken, async (req, res) => {
  const { date } = req.query;
  
  if (!date) {
    return res.status(400).json({ message: 'Date is required' });
  }

  try {
    const appointments = await Appointment.find({ date });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching appointments' });
  }
});



// Helper function to group appointments by day of the week
const getAppointmentsPerDay = (appointments) => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const appointmentCounts = new Array(7).fill(0); // Initialize array for each day of the week

  appointments.forEach((appointment) => {
    const day = new Date(appointment.date).getDay(); // Get the day of the week (0 for Sunday, 6 for Saturday)
    appointmentCounts[day]++;
  });

  return appointmentCounts;
};

// Route to get the number of appointments per day of the week
router.get('/appointments/per-day', async (req, res) => {
  try {
    const appointments = await Appointment.find({ status: 'active' }); // Only active appointments
    const appointmentsPerDay = getAppointmentsPerDay(appointments);
    res.json(appointmentsPerDay);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments per day', error });
  }
});


// Controller to get gender count
const getPatientGenderCount = async (req, res) => {
  try {
      const maleCount = await Patient.countDocuments({ gender: 'Male' });
      const femaleCount = await Patient.countDocuments({ gender: 'Female' });
      const otherCount = await Patient.countDocuments({ gender: 'Other' });

      res.status(200).json({
          male: maleCount,
          female: femaleCount,
          other: otherCount,
      });
  } catch (error) {
      res.status(500).json({ message: 'Error fetching patient gender count', error });
  }
};

// Add route to get gender counts
router.get('/patients/gender-count', getPatientGenderCount);


module.exports = router;

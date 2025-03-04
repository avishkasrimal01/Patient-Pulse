import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams
import CountUp from "react-countup";
import VisibilitySensor from "react-visibility-sensor";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Grid,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

import countIcon1 from "../../assets/images/profile/2.png";
import countIcon2 from "../../assets/images/profile/3.png";
import countIcon3 from "../../assets/images/profile/4.png";
import profileicon from "../../assets/images/instructor/1.jpg";
import fingerprintAnimation from "../../assets/images/fingerprint-animation.gif"; // Replace with your fingerprint animation asset

const ProfileDetailsMain = () => {
  const { userId } = useParams(); // Extract the userId from the URL
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [totalRemoteAppointments, setTotalRemoteAppointments] = useState(0);
  const [totalPhysicalAppointments, setTotalPhysicalAppointments] = useState(0);
  const [hasFingerprint, setHasFingerprint] = useState(false); // New state to track if fingerprint exists
  const [state, setState] = useState(true);
  const [isAdded, setIsAdded] = useState(false);
  const [confirmDialogOpen2, setConfirmDialogOpen2] = useState(false);
  const [patientFinger, setPatientFinger] = useState(null);

  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchTotalRemoteAppointments = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/user/${userId}/remoteCount`
        );
        setTotalRemoteAppointments(response.data.count);
      } catch (error) {
        console.error("Error fetching total remote appointments:", error);
      }
    };
    fetchTotalRemoteAppointments();
  }, [userId]);

  useEffect(() => {
    const fetchTotalPhysicalAppointments = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/user/${userId}/physicalCount`
        );
        setTotalPhysicalAppointments(response.data.count);
      } catch (error) {
        console.error("Error fetching total physical appointments:", error);
      }
    };
    fetchTotalPhysicalAppointments();
  }, [userId]);

  useEffect(() => {
    const fetchPatientProfile = async () => {
      try {
        const response = await axios.get(`${apiUrl}/profile/${userId}`); // Pass userId from the URL
        setPatient(response.data);
        setHasFingerprint(response.data.hasFingerprint || false); // Assuming the profile response contains a `hasFingerprint` field
      } catch (error) {
        console.error("Error fetching patient profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatientProfile();
  }, [userId]);

  const handleAddFingerprint = () => {
    Swal.fire({
      title: "Add Fingerprint",
      html: `
                <div>
                    <p>Please place your hand on the sensor</p>
                    <img src="${fingerprintAnimation}" alt="Fingerprint Animation" style="width: 200px; height: auto;" />
                </div>
            `,
      showConfirmButton: false,
      timer: 5000, // The animation or detection duration
    }).then(() => {
      // Make API call to register fingerprint
      axios
        .post(`${apiUrl}/register-fingerprint`, { userId })
        .then(() => {
          toast.success("Fingerprint added successfully!");
          setHasFingerprint(true);
        })
        .catch(() => {
          toast.error("Failed to add fingerprint. Please try again.");
        });
    });
  };

  const handleAddFinger = (id) => {
    setPatientFinger(id);
    setIsAdded(false);

    const fingerPrintId = id.split("U00")[1];
    const fingerprintCount = parseInt(fingerPrintId, 10);

    // Payload
    const payload = {
      DeviceMode: "signup",
      FingerPrintCount: fingerprintCount,
      GetUser: id,
    };

    axios
      .post(`${apiUrl}/addFingerprintData`, payload)
      .then((res) => {
        console.log(res.data);
        setConfirmDialogOpen2(true); // Open the modal

        // Start checking if DeviceMode is "auth" after modal opens
        const interval = setInterval(async () => {
          try {
            const response = await axios.get(`${apiUrl}/checkDeviceMode`);
            if (response.data.status === true) {
              // setConfirmDialogOpen2(false);
              setIsAdded(true);
              clearInterval(interval);
            }
          } catch (error) {
            console.error("Error checking device mode:", error);
          }
        }, 3000);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleDeleteAccount = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action will request account deletion. Please confirm!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, request deletion!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(
            `${apiUrl}/request-delete-account`,
            { userId } // Include userId in the body or as part of the route if needed
          );
          toast.success("Deletion email sent! Please confirm via your inbox.");
          navigate("/signup");
        } catch (error) {
          toast.error("Failed to request account deletion");
        }
      }
    });
  };

  const calculateAge = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const counters = [
    {
      countNum: totalPhysicalAppointments,
      countTitle: "Physical Appointments",
      countIcon: countIcon1,
    },
    {
      countNum: totalRemoteAppointments,
      countTitle: "Remote Appointments",
      countIcon: countIcon2,
    },
    { countNum: 208, countTitle: "", countIcon: countIcon3 },
  ];

  if (loading) return <div>Loading...</div>;
  if (!patient) return <div>Error: No patient data found</div>;

  const age = patient.dob ? calculateAge(patient.dob) : "N/A";

  return (
    <>
      <div className="profile-top back__course__area pt---120 pb---90">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}
 >
            <Button
              variant="contained"
              color="primary"
              onClick={(e) => {
                handleAddFingerprint(patient);
              }}
            >
              Add Fingerprint
            </Button>
          </div>
          <div className="row">
            <div className="col-lg-4">
              <img src={profileicon} alt={patient.name || "Unknown"} />
            </div>
            <div className="col-lg-8">
              <ul className="user-section">
                <li>
                  <span>Name:</span> <em>{patient.name || "Unknown"}</em>
                </li>
                <li>
                  Phone: <em>{patient.number || "N/A"}</em>
                </li>
                <li>
                  Email: <em>{patient.email || "N/A"}</em>
                </li>
                <li>
                  Blood Group: <em>{patient.bloodGroup || "N/A"}</em>
                </li>
                <li>
                  Gender: <em>{patient.gender || "N/A"}</em>
                </li>
                <li>
                  Age: <em>{age}</em>
                </li>
              </ul>

              <div className="count__area2">
                <ul className="row">
                  {counters.map((counter, num) => (
                    <li key={num} className="col-lg-4">
                      <div className="count__content">
                        <div className="icon">
                          <img src={counter.countIcon} alt="profile" />
                        </div>
                        <div className="text">
                          <CountUp
                            start={state ? 0 : counter.countNum}
                            end={counter.countNum}
                            duration={5}
                            onEnd={() => setState(false)}
                          />
                          {({ countUpRef, start }) => (
                            <VisibilitySensor onChange={start} delayedCall>
                              <span ref={countUpRef} />
                              <span className="count__content-title counter">
                                {counter.countNum}
                              </span>
                            </VisibilitySensor>
                          )}
                          <p>{counter.countTitle}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <Dialog
                open={confirmDialogOpen2}
                onClose={() => setConfirmDialogOpen2(false)}
              >
                <DialogTitle>Add Fingerprint</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Please place your finger on the fingerprint scanner to
                    proceed with the enrollment.
                  </DialogContentText>
                  <img
                    src="https://img.freepik.com/free-vector/fingerprint-concept-illustration_114360-3021.jpg?t=st=1729112904~exp=1729116504~hmac=bcca9675dafe916c816646555a8dea2e431b8449d3492548f7a8765b9c0d9715&w=900"
                    alt="Fingerprint Scanner"
                    style={{
                      width: "300px",
                      height: "300px",
                      margin: "20px auto",
                      display: "block",
                    }}
                  />
                  {isAdded ? (
                    <DialogContentText>Successfully Added..!</DialogContentText>
                  ) : (
                    <DialogContentText>
                      Processing... Please wait
                    </DialogContentText>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setConfirmDialogOpen2(false)}>
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => setConfirmDialogOpen2(false)}
                    disabled={!isAdded}
                  >
                    Ok
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default ProfileDetailsMain;

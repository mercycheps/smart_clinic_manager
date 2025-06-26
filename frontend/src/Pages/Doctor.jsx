import React, { useEffect, useState } from "react";
import "../components/styling/doctor.css";
import { Calendar, Users, Clock, TrendingUp } from "lucide-react";

const DoctorDashboard = ({ refreshFlag }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch("http://localhost:5000/api/doctors", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch doctors");
        }

        const data = await res.json();
        setDoctors(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch doctor data:", err);
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [refreshFlag]);

  const getStatusClass = (status) => {
    switch (status) {
      case "available":
        return "badge badge-green";
      case "busy":
        return "badge badge-yellow";
      case "surgery":
        return "badge badge-red";
      default:
        return "badge badge-gray";
    }
  };

  const stats = [
    {
      title: "Total Doctors",
      value: doctors.length.toString(),
      icon: <Users />,
      change: "+2 this month",
    },
    {
      title: "Appointments Today",
      value: "35",
      icon: <Calendar />,
      change: "+8 from yesterday",
    },
    {
      title: "Average Wait Time",
      value: "12 min",
      icon: <Clock />,
      change: "-3 min improved",
    },
    {
      title: "Patient Satisfaction",
      value: "4.8/5",
      icon: <TrendingUp />,
      change: "+0.2 this month",
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="grid-stats">
        {stats.map((stat, index) => (
          <div className="card" key={index}>
            <div className="card-content">
              <div className="stat-box">
                <div>
                  <p className="stat-title">{stat.title}</p>
                  <p className="stat-value">{stat.value}</p>
                  <p className="stat-change">{stat.change}</p>
                </div>
                <div className="stat-icon">{stat.icon}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Doctor Overview</h2>
          <p className="card-description">
            Current status and schedule for all doctors
          </p>
        </div>
        <div className="card-content">
          {loading ? (
            <p className="text-muted">Loading doctors...</p>
          ) : (
            <div className="grid-doctors">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="doctor-card">
                  <div className="doctor-header">
                    <div>
                      <h3 className="doctor-name">{doctor.name}</h3>
                      <p className="doctor-specialty">{doctor.specialty}</p>
                    </div>
                    <span className={getStatusClass(doctor.status)}>
                      {doctor.status}
                    </span>
                  </div>
                  <div className="doctor-body">
                    <div className="row">
                      <span>Patients Today:</span>
                      <span>{doctor.patientsToday}</span>
                    </div>
                    <div className="row">
                      <span>Total Patients:</span>
                      <span>{doctor.totalPatients}</span>
                    </div>
                    <div className="appointment-box">
                      <p className="appointment-label">Next Appointment:</p>
                      <p className="appointment-time">
                        {doctor.nextAppointment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;

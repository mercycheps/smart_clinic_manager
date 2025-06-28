import React from 'react';
import { Link } from 'react-router-dom';
import "../components/styles/landing.css";

const Index = () => {
  return (
    <div className="landing">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="header-left">
            <div className="logo-circle">
              <span className="stethoscope-icon">🩺</span>
            </div>
            <div>
              <span className="brand-name">SmartClinic</span>
              <p className="tagline">Healthcare Management</p>
            </div>
          </div>
          <nav className="nav-links">
            <a href="#features">Features</a>
            <a href="#contact">Contact</a>
            <Link to="/login" className="btn-outline">Sign In</Link>
            <Link to="/register" className="btn-outline">Sign Up</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span role="img" aria-label="heart">❤️</span> Trusted by 10,000+ Healthcare Providers
          </div>
          <h1 className="hero-title">
            Modern Healthcare <span className="highlight">Management System</span>
          </h1>
          <p className="hero-description">
            Streamline your clinic operations with our intelligent platform. From appointment scheduling to patient records, 
            we provide everything you need to deliver exceptional healthcare services.
          </p>
          <div className="hero-highlights">
            <span>✅ 24/7 Support</span>
            <span>✅ No Setup Fees</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stat"><h2>10,000+</h2><p>Active Clinics</p></div>
        <div className="stat"><h2>2M+</h2><p>Patients Managed</p></div>
        <div className="stat"><h2>99.9%</h2><p>Uptime Guarantee</p></div>
        <div className="stat"><h2>4.9/5</h2><p>Customer Rating</p></div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <h2>Everything Your Clinic Needs</h2>
        <p>Comprehensive tools designed specifically for modern healthcare practices. Streamline operations and focus on what matters most – patient care.</p>
        <div className="feature-list">
          <div className="feature">
            <div className="feature-icon">📅</div>
            <h3>Smart Scheduling</h3>
            <p>AI-powered appointment booking with automated reminders, conflict detection, and intelligent resource allocation.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">👥</div>
            <h3>Patient Management</h3>
            <p>Complete patient profiles with medical history, treatment plans, and secure communication tools.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">📄</div>
            <h3>Digital Health Records</h3>
            <p>Paperless EHR system with instant access, advanced search, and complete compliance management.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">📊</div>
            <h3>Analytics Dashboard</h3>
            <p>Real-time insights, performance metrics, and comprehensive reporting for data-driven decisions.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🛡️</div>
            <h3>Enterprise Security</h3>
            <p>Bank-level encryption, HIPAA compliance, audit trails, and advanced access controls.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">⏰</div>
            <h3>24/7 Support</h3>
            <p>Round-the-clock expert support with dedicated healthcare IT specialists and training resources.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo-circle">🩺</div>
            <span className="brand-name">SmartClinic</span>
            <p>Empowering healthcare providers with intelligent clinic management solutions.</p>
            <div className="stars">⭐⭐⭐⭐⭐ <span>4.9/5 from 2,000+ reviews</span></div>
          </div>
          <div className="footer-columns">
            <div>
              <h4>Product</h4>
              <ul>
                <li><a href="#">Features</a></li>
                <li><a href="#">Security</a></li>
                <li><a href="#">Integrations</a></li>
                <li><a href="#">API</a></li>
              </ul>
            </div>
            <div>
              <h4>Support</h4>
              <ul>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Training</a></li>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">System Status</a></li>
                <li><a href="#">Community</a></li>
              </ul>
            </div>
            <div>
              <h4>Company</h4>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 SmartClinic. All rights reserved.</p>
          <p>Made with ❤️ for healthcare providers</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

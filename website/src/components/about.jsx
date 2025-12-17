import React from "react";
import "./about.css";

const AboutUs = () => {
  return (
    <div className="about-container">

      {/* HERO */}
      <section className="hero-section">
        <h1>About Us</h1>
        <p>
          Welcome to <strong>StruggleMeals101!</strong> Where college students and
          food lovers,can discover affordable,
          easy, and delicious recipes. This was created by students, for students!
        </p>
      </section>

      {/* TEAM */}
      <section className="team-section">
        <h2>Meet the Team</h2>
        <div className="team-grid">

          <div className="team-card">
            <img src="/images/pari.jpg" alt="Team Member" />
            <h3>Pari Kulkarni</h3>
            <p>Frontend + UX Design</p>
          </div>

          <div className="team-card">
            <img src="/images/katie.jpeg" alt="Team Member" />
            <h3>Katie Li</h3>
            <p>Backend + API Integration</p>
          </div>

          <div className="team-card">
            <img src="/images/pia.jpg" alt="Team Member" />
            <h3>Pia Robinson</h3>
            <p>Frontend + UX Design</p>
          </div>

          <div className="team-card">
            <img src="/images/jaib.jpeg" alt="Team Member" />
            <h3>Jaibilin Jain</h3>
            <p>Backend + Firebase</p>
          </div>

        </div>
      </section>

      {/* MISSION*/}
      <section className="mission-section">
        <h2>Our Mission</h2>
        <p>
          We founded StruggleMeals101 with a simple idea:  
          "no student should have to eat boring food just because they’re on a budget."
        </p>
        <p>
          Our platform brings affordable ingredients, step–by–step recipes,
          AI–powered recommendations, and a supportive food community: all in one place!
        </p>
      </section>

      {/* CONTACT */}
      <section className="contact-section">
      </section>

    </div>
  );
};

export default AboutUs;

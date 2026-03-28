import React from 'react'
import './About.css'

export default function About() {
  return (
    <div className="about-page">
      <div className="about-container">
        <section className="about-hero">
          <h1 className="about-title">About Wolves Footwear Store</h1>
          <p className="about-subtitle">Selling Quality Footwear Since 1999</p>
        </section>

        <section className="about-section">
          <h2>Our Story</h2>
          <p>
            Wolves Footwear Store was founded with a mission to provide high-quality, stylish, and comfortable 
            footwear to customers worldwide. We believe that the right pair of shoes can transform your day and 
            boost your confidence.
          </p>
          <p>
            Starting from a small boutique, we've grown into a trusted brand known for our commitment to quality, 
            customer service, and innovation in footwear design.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            To deliver exceptional footwear products that combine style, comfort, and durability. We aim to provide 
            our customers with the best shopping experience and build lasting relationships based on trust and quality.
          </p>
        </section>

        <section className="about-section">
          <h2>Why Choose Us?</h2>
          <ul className="features-list">
            <li>
              <strong>Premium Quality:</strong> All our shoes are made from high-quality materials and undergo strict 
              quality control.
            </li>
            <li>
              <strong>Wide Selection:</strong> From casual sneakers to formal shoes, we have something for everyone.
            </li>
            <li>
              <strong>Competitive Prices:</strong> Get premium quality at affordable prices.
            </li>
            <li>
              <strong>Excellent Customer Service:</strong> Our dedicated team is here to help you find the perfect pair.
            </li>
            <li>
              <strong>Fast Shipping:</strong> We deliver orders promptly to your doorstep.
            </li>
            <li>
              <strong>Easy Returns:</strong> Not satisfied? Return within 30 days for a full refund.
            </li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>Quality</h3>
              <p>We never compromise on the quality of our products</p>
            </div>
            <div className="value-card">
              <h3>Integrity</h3>
              <p>Honesty and transparency in all our dealings</p>
            </div>
            <div className="value-card">
              <h3>Customer First</h3>
              <p>Your satisfaction is our highest priority</p>
            </div>
            <div className="value-card">
              <h3>Innovation</h3>
              <p>Constantly improving and evolving our offerings</p>
            </div>
          </div>
        </section>

        <section className="about-section contact-section">
          <h2>Get In Touch</h2>
          <p>Have questions? We'd love to hear from you!</p>
          <div className="contact-info">
            <p><strong>Email:</strong> arevalo.paulina29@gmail.com</p>
            <p><strong>Phone:</strong> 09628613540</p>
            <p><strong>Address:</strong> Sta Rita Public Market ALL GOODS </p>
            <p><strong>Hours:</strong> Mon - Sun: 6:00 AM - 6:30 PM  </p>
          </div>
        </section>
      </div>
    </div>
  )
}

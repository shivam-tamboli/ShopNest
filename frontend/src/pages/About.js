import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { 
  FaShippingFast, 
  FaShieldAlt, 
  FaHeadset, 
  FaAward,
  FaHeart,
  FaRocket,
  FaUsers,
  FaShoppingBag
} from 'react-icons/fa'
import '../styles/about.css'

function AboutPage() {
  const teamMembers = [
    {
      name: "Pranoti Tamboli",
      role: "Founder & CEO",
      image: "/images/team/shivam.jpg",
      bio: "Passionate about creating seamless e-commerce experiences."
    },
    {
      name: "Alex Johnson",
      role: "Head of Technology",
      image: "/images/team/alex.jpg", 
      bio: "Ensuring our platform is fast, secure, and reliable."
    },
    {
      name: "Shivam Tamboli",
      role: "Product Director",
      image: "/images/team/sarah.jpg",
      bio: "Curating the best products for our customers."
    }
  ]

  const values = [
    {
      icon: <FaHeart className="value-icon" />,
      title: "Customer First",
      description: "Your satisfaction is our top priority in every decision we make."
    },
    {
      icon: <FaRocket className="value-icon" />,
      title: "Innovation",
      description: "Constantly evolving to bring you the best shopping experience."
    },
    {
      icon: <FaShieldAlt className="value-icon" />,
      title: "Trust & Security",
      description: "Your data and transactions are protected with enterprise-grade security."
    },
    {
      icon: <FaUsers className="value-icon" />,
      title: "Community",
      description: "Building relationships that go beyond just transactions."
    }
  ]

  const stats = [
    { number: "10K+", label: "Happy Customers" },
    { number: "50K+", label: "Products Available" },
    { number: "24/7", label: "Customer Support" },
    { number: "100%", label: "Secure Payments" }
  ]

  return (
    <div className="about-page-wrapper">
      <Container className="about-page py-5">
        {/* Hero Section */}
        <Row className="align-items-center mb-5 hero-section">
          <Col lg={6}>
            <h1 className="display-4 text-primary mb-4">
              Welcome to <span className="brand-highlight">ShopNest</span>
            </h1>
            <p className="lead mb-4">
              Where shopping meets <strong>simplicity, security, and style</strong>. 
              We're revolutionizing e-commerce with a platform designed around your needs.
            </p>
            <div className="hero-features">
              <span className="feature-tag">🚀 Fast Delivery</span>
              <span className="feature-tag">🛡️ Secure Payments</span>
              <span className="feature-tag">⭐ Premium Quality</span>
            </div>
          </Col>
          <Col lg={6}>
            <div className="hero-image-container">
              <img
                src="/images/about-hero.jpg"
                alt="ShopNest shopping experience"
                className="img-fluid rounded shadow-lg hero-image"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                }}
              />
            </div>
          </Col>
        </Row>

        {/* Stats Section */}
        <Row className="stats-section mb-5 py-4">
          {stats.map((stat, index) => (
            <Col lg={3} md={6} key={index} className="text-center mb-3">
              <div className="stat-item">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </Col>
          ))}
        </Row>

        {/* Mission & Vision */}
        <Row className="mission-vision-section mb-5">
          <Col md={6} className="mb-4">
            <Card className="h-100 mission-card shadow-sm">
              <Card.Body className="text-center">
                <FaRocket className="mission-icon text-primary mb-3" size={48} />
                <Card.Title className="h4">Our Mission</Card.Title>
                <Card.Text>
                  To create an intuitive, joyful shopping experience that makes finding 
                  and buying products effortless. We're committed to bringing you the 
                  latest trends with unmatched convenience and security.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="h-100 vision-card shadow-sm">
              <Card.Body className="text-center">
                <FaAward className="vision-icon text-success mb-3" size={48} />
                <Card.Title className="h4">Our Vision</Card.Title>
                <Card.Text>
                  To become the most trusted e-commerce platform where customers 
                  feel valued, products tell stories, and every purchase brings 
                  satisfaction and excitement.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Our Values */}
        <section className="values-section mb-5">
          <h2 className="text-center mb-5 section-title">Our Values</h2>
          <Row>
            {values.map((value, index) => (
              <Col lg={3} md={6} key={index} className="mb-4">
                <Card className="h-100 value-card text-center border-0">
                  <Card.Body>
                    <div className="value-icon-container mb-3">
                      {value.icon}
                    </div>
                    <Card.Title className="h5">{value.title}</Card.Title>
                    <Card.Text className="text-muted">
                      {value.description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Why Choose Us */}
        <section className="features-section mb-5">
          <h2 className="text-center mb-5 section-title">Why Choose ShopNest?</h2>
          <Row>
            <Col md={4} className="mb-4">
              <div className="feature-item text-center">
                <FaShippingFast className="feature-icon text-primary mb-3" size={40} />
                <h5>Fast & Free Shipping</h5>
                <p className="text-muted">Get your orders delivered quickly with our reliable shipping partners.</p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="feature-item text-center">
                <FaShieldAlt className="feature-icon text-success mb-3" size={40} />
                <h5>Secure Payments</h5>
                <p className="text-muted">Shop with confidence using our bank-level secure payment system.</p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="feature-item text-center">
                <FaHeadset className="feature-icon text-info mb-3" size={40} />
                <h5>24/7 Support</h5>
                <p className="text-muted">Our customer support team is always here to help you.</p>
              </div>
            </Col>
          </Row>
        </section>

        {/* Team Section */}
        <section className="team-section mb-5">
          <h2 className="text-center mb-5 section-title">Meet Our Team</h2>
          <Row>
            {teamMembers.map((member, index) => (
              <Col lg={4} md={6} key={index} className="mb-4">
                <Card className="team-card text-center shadow-sm">
                  <div className="team-image-container">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="team-image"
                      onError={(e) => {
                        e.target.src = `https://i.pravatar.cc/150?img=${index + 10}`
                      }}
                    />
                  </div>
                  <Card.Body>
                    <Card.Title className="h5">{member.name}</Card.Title>
                    <Card.Subtitle className="text-primary mb-2">{member.role}</Card.Subtitle>
                    <Card.Text className="text-muted">{member.bio}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* CTA Section */}
        <section className="cta-section text-center py-5">
          <Row className="justify-content-center">
            <Col lg={8}>
              <h2 className="mb-4">Ready to Start Shopping?</h2>
              <p className="lead mb-4">
                Join thousands of satisfied customers who trust ShopNest for their shopping needs.
              </p>
              <a href="/products" className="btn btn-primary btn-lg cta-button">
                Start Shopping Now
              </a>
            </Col>
          </Row>
        </section>

        {/* Contact Section */}
        <section className="contact-section text-center">
          <h2 className="mb-4">Get In Touch</h2>
          <p className="lead mb-4">
            Have questions or feedback? We'd love to hear from you!
          </p>
          <div className="contact-options">
            <a href="mailto:support@shopnest.com" className="btn btn-outline-primary me-3">
              📧 support@shopnest.com
            </a>
            <a href="/contact" className="btn btn-outline-success">
              📞 Contact Form
            </a>
          </div>
        </section>
      </Container>
    </div>
  )
}

export default AboutPage
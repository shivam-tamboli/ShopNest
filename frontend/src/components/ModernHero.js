import React from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/ModernHero.css';

const ModernHero = () => {
  const history = useHistory();

  const handleShopNow = () => {
    history.push('/products');
  };

  const handleLearnMore = () => {
    history.push('/about');
  };

  return (
    <section className="modern-hero">
      <div className="hero-content">
        <h1 className="hero-title">
          Welcome to <span className="gradient-text">ShopNest</span>
        </h1>
        <p className="hero-subtitle">
          Discover amazing products and exclusive deals. Shop the latest trends 
          with fast delivery and excellent customer service.
        </p>
        <div className="hero-buttons">
          <button className="btn-primary" onClick={handleShopNow}>
            <i className="fas fa-shopping-bag me-2"></i>
            Shop Now
          </button>
          <button className="btn-secondary" onClick={handleLearnMore}>
            <i className="fas fa-info-circle me-2"></i>
            Learn More
          </button>
        </div>
        
        {/* Trust indicators */}
        <div className="trust-indicators">
          <div className="trust-item">
            <i className="fas fa-shipping-fast"></i>
            <span>Free Shipping</span>
          </div>
          <div className="trust-item">
            <i className="fas fa-shield-alt"></i>
            <span>Secure Payment</span>
          </div>
          <div className="trust-item">
            <i className="fas fa-headset"></i>
            <span>24/7 Support</span>
          </div>
        </div>
      </div>
      
      {/* Enhanced Hero Visual Section */}
      <div className="hero-visual">
        <div className="feature-card card-1">
          <div className="card-icon">
            <i className="fas fa-bolt"></i>
          </div>
          <div className="card-content">
            <h3>Fast Delivery</h3>
            <p>2-3 days shipping</p>
          </div>
        </div>
        
        <div className="feature-card card-2">
          <div className="card-icon">
            <i className="fas fa-star"></i>
          </div>
          <div className="card-content">
            <h3>Premium Quality</h3>
            <p>100% verified products</p>
          </div>
        </div>
        
        <div className="feature-card card-3">
          <div className="card-icon">
            <i className="fas fa-award"></i>
          </div>
          <div className="card-content">
            <h3>Best Prices</h3>
            <p>Price match guarantee</p>
          </div>
        </div>

        {/* Central main visual */}
        <div className="main-visual">
          <div className="visual-circle">
            <i className="fas fa-shopping-cart"></i>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernHero;
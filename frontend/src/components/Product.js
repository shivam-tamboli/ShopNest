import { Card, Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import React from "react";
import "../styles/product.css";

function Product({ product }) {
    // Generate demo data (replace with actual data from backend later)
    const rating = 4.0 + (Math.random() * 1.0); // Random rating between 4.0-5.0
    const isInStock = product.stock !== undefined ? product.stock : true;
    const isPopular = Math.random() > 0.7; // 30% chance to be popular
    const isNew = Math.random() > 0.8; // 20% chance to be new

    // Function to render star ratings
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < fullStars; i++) {
            stars.push('⭐');
        }
        if (hasHalfStar && stars.length < 5) {
            stars.push('⭐');
        }
        while (stars.length < 5) {
            stars.push('☆');
        }
        return stars.join('');
    };

    return (
        <Card className="product-card-enhanced">
            <div className="product-image-container position-relative">
                <Link to={`/product/${product.id}`}>
                    <Card.Img
                        variant="top"
                        src={product.image || "/images/placeholder.png"}
                        alt={product.name}
                        className="product-image"
                    />
                </Link>
                
                {/* Product Badges */}
                <div className="product-badges">
                    {isNew && <Badge bg="success" className="product-badge new-badge">New</Badge>}
                    {isPopular && <Badge bg="danger" className="product-badge popular-badge">Popular</Badge>}
                    {!isInStock && <Badge bg="secondary" className="product-badge stock-badge">Out of Stock</Badge>}
                </div>
            </div>

            <Card.Body className="product-card-body">
                <Link to={`/product/${product.id}`} className="text-decoration-none">
                    <Card.Title as="div" className="product-title">
                        <strong>{product.name}</strong>
                    </Card.Title>
                </Link>

                {/* Product Rating */}
                <div className="product-rating">
                    <span className="stars">{renderStars(rating)}</span>
                    <span className="rating-text">({rating.toFixed(1)})</span>
                </div>

                {/* Product Price */}
                <Card.Text as="div" className="product-price-container">
                    <span className="product-price">
                        {new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                        }).format(product.price)}
                    </span>
                </Card.Text>

                {/* Stock Status */}
                <div className="stock-status">
                    {isInStock ? (
                        <Badge bg="success" className="stock-status-badge in-stock">
                            ✓ In Stock
                        </Badge>
                    ) : (
                        <Badge bg="secondary" className="stock-status-badge out-of-stock">
                            ✗ Out of Stock
                        </Badge>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="product-actions">
                    <Link to={`/product/${product.id}`} className="btn btn-outline-primary btn-view-details">
                        View Details
                    </Link>
                    <Button 
                        variant="primary" 
                        className="btn-add-to-cart"
                        disabled={!isInStock}
                    >
                        {isInStock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
}

export default Product;
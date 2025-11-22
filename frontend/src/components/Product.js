import { Card, Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../actions/cartActions';
import { toggleWishlist } from '../actions/wishlistActions';
import "../styles/product.css";

function Product({ product }) {
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.userLoginReducer);

    const isInStock = product.stock !== undefined ? product.stock : true;
    const isNew = product.is_new || false;
    const isPopular = product.is_popular || false;
    const isWishlisted = product.is_wishlisted || false;
    
    const rating = 4.0 + ((product.id % 10) / 10);

    const handleAddToCart = () => {
        if (!userInfo) {
            alert('Please login to add items to cart');
            return;
        }
        dispatch(addToCart(product.id, 1));
    };

    const handleWishlistToggle = () => {
        if (!userInfo) {
            alert('Please login to add to wishlist');
            return;
        }
        dispatch(toggleWishlist(product.id));
    };

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
                        onError={(e) => {
                            e.target.src = "/images/placeholder.png";
                        }}
                    />
                </Link>
                
                <div className="product-badges">
                    {isNew && <Badge bg="success" className="product-badge new-badge">New</Badge>}
                    {isPopular && <Badge bg="danger" className="product-badge popular-badge">Popular</Badge>}
                    {!isInStock && <Badge bg="secondary" className="product-badge stock-badge">Out of Stock</Badge>}
                </div>

                <Button 
                    variant={isWishlisted ? "danger" : "outline-danger"}
                    className="wishlist-heart"
                    onClick={handleWishlistToggle}
                >
                    {isWishlisted ? '❤️' : '🤍'}
                </Button>
            </div>

            <Card.Body className="product-card-body">
                <Link to={`/product/${product.id}`} className="text-decoration-none">
                    <Card.Title as="div" className="product-title">
                        <strong>{product.name}</strong>
                    </Card.Title>
                </Link>

                <div className="product-rating">
                    <span className="stars">{renderStars(rating)}</span>
                    <span className="rating-text">({rating.toFixed(1)})</span>
                </div>

                <Card.Text as="div" className="product-price-container">
                    <span className="product-price">
                        {new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                        }).format(product.price || 0)}
                    </span>
                </Card.Text>

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

                <div className="product-actions">
                    <Link to={`/product/${product.id}`} className="btn btn-outline-primary btn-view-details">
                        View Details
                    </Link>
                    <Button 
                        variant="primary" 
                        className="btn-add-to-cart"
                        disabled={!isInStock}
                        onClick={handleAddToCart}
                    >
                        {isInStock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
}

export default Product;
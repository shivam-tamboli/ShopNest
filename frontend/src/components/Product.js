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
        <div className="modern-product-card">
            <div className="product-image-section">
                <Link to={`/product/${product.id}`}>
                    <img
                        src={product.image || "/images/placeholder.png"}
                        alt={product.name}
                        className="product-image"
                        onError={(e) => {
                            e.target.src = "/images/placeholder.png";
                        }}
                    />
                </Link>
                
                <div className="product-badges">
                    {isNew && <span className="badge new-badge">New</span>}
                    {isPopular && <span className="badge popular-badge">Trending</span>}
                    {!isInStock && <span className="badge stock-badge">Out of Stock</span>}
                </div>

                <button 
                    className={`wishlist-heart ${isWishlisted ? 'wishlisted' : ''}`}
                    onClick={handleWishlistToggle}
                >
                    {isWishlisted ? '❤️' : '🤍'}
                </button>
            </div>

            <div className="product-content">
                <Link to={`/product/${product.id}`} className="text-decoration-none">
                    <h3 className="product-title">{product.name}</h3>
                </Link>

                <div className="product-rating">
                    <span className="stars">{renderStars(rating)}</span>
                    <span className="rating-text">({rating.toFixed(1)})</span>
                </div>

                <div className="product-price">
                    {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                    }).format(product.price || 0)}
                </div>

                <div className="stock-status">
                    {isInStock ? (
                        <span className="stock-badge in-stock">✓ In Stock</span>
                    ) : (
                        <span className="stock-badge out-of-stock">✗ Out of Stock</span>
                    )}
                </div>

                <div className="product-actions">
                    <Link to={`/product/${product.id}`} className="btn-view-details">
                        View Details
                    </Link>
                    <button 
                        className={`btn-add-to-cart ${!isInStock ? 'disabled' : ''}`}
                        disabled={!isInStock}
                        onClick={handleAddToCart}
                    >
                        {isInStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Product;
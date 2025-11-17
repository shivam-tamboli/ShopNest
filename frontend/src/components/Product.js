import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../actions/cartActions';
import { Card, Button, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Message from './Message';

const Product = ({ product }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // FIX: Access the correct state structure
    const { userInfo } = useSelector(state => state.userLoginReducer);
    const { loading: cartLoading, error: cartError } = useSelector(state => state.cartReducer);

    const handleAddToCart = async () => {
        if (!userInfo) {
            setError('Please login to add items to cart');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await dispatch(addToCart(product.id, 1));
            // Success - you can add a toast notification here
            console.log('Product added to cart successfully');
        } catch (error) {
            console.error('Add to cart error:', error);
            setError('Failed to add product to cart');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    return (
        <Card className="product-card-enhanced h-100">
            {/* Product Image */}
            <div className="product-image-container">
                <Card.Img 
                    variant="top" 
                    src={product.image} 
                    className="product-image"
                    alt={product.name}
                />
                <div className="product-badges">
                    {product.is_new && (
                        <span className="product-badge new-badge">New</span>
                    )}
                    {product.is_hot && (  // ADD THIS
                        <span className="product-badge hot-badge">Hot</span>
                    )}
                    {product.is_popular && (  // ADD THIS
                        <span className="product-badge popular-badge">Popular</span>
                    )}
                </div>
            </div>

            <Card.Body className="product-card-body d-flex flex-column">
                {/* Product Title */}
                <Card.Title className="product-title">
                    <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
                        {product.name}
                    </Link>
                </Card.Title>

                {/* Product Rating */}
                <div className="product-rating">
                    <span className="stars">⭐⭐⭐⭐</span>
                    <span className="rating-text">(No ratings)</span>
                </div>

                {/* Product Price */}
                <div className="product-price-container">
                    <span className="product-price">
                        {formatPrice(product.price)}
                    </span>
                </div>

                {/* Stock Status */}
                <div className="stock-status">
                    <Badge 
                        className={`stock-status-badge ${product.in_stock ? 'in-stock' : 'out-of-stock'}`}
                    >
                        {product.in_stock ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                </div>

                {/* Error Message */}
                {error && (
                    <Message variant="danger" className="mt-2">
                        {error}
                    </Message>
                )}

                {/* Product Actions */}
                <div className="product-actions mt-auto">
                    <Button 
                        variant="outline-primary" 
                        className="btn-view-details w-100 mb-2"
                        as={Link}
                        to={`/product/${product.id}`}
                    >
                        View Details
                    </Button>
                    
                    <Button 
                        variant="primary" 
                        className="btn-add-to-cart w-100"
                        onClick={handleAddToCart}
                        disabled={!product.in_stock || loading || cartLoading}
                    >
                        {loading || cartLoading ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                />
                                Adding...
                            </>
                        ) : (
                            product.in_stock ? 'Add to Cart' : 'Out of Stock'
                        )}
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default Product;
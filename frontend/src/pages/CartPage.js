import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import Message from '../components/Message';
import { getCart, removeFromCart, updateCartItem } from '../actions/cartActions';
import '../styles/cart.css';

// Custom Tooltip Component
const CustomTooltip = ({ text, children, placement = 'top' }) => {
    const [show, setShow] = useState(false);

    return (
        <div
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
            className="tooltip-container"
        >
            {children}
            {show && (
                <div className={`tooltip ${placement}`}>
                    {text}
                    <div className="tooltip-arrow"></div>
                </div>
            )}
        </div>
    );
};

function CartPage() {
    const dispatch = useDispatch();
    const history = useHistory();

    const userLoginReducer = useSelector((state) => state.userLoginReducer);
    const { userInfo } = userLoginReducer;

    const cartReducer = useSelector((state) => state.cartReducer);
    const { loading, error, cart } = cartReducer;

    // Local state for remove confirmation modal
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [removeProductId, setRemoveProductId] = useState(null);

    // cart items with fallback
    const items = cart?.items || [];
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = items.reduce((acc, item) => acc + parseFloat(item.product.price || 0) * item.quantity, 0);

    useEffect(() => {
        if (!userInfo) {
            history.push('/login');
        } else {
            dispatch(getCart());
        }
    }, [dispatch, userInfo, history]);

    const handleRemoveFromCart = (productId) => {
        setRemoveProductId(productId);
        setShowRemoveModal(true);
    };

    const confirmRemove = () => {
        if (removeProductId) {
            dispatch(removeFromCart(removeProductId));
        }
        setShowRemoveModal(false);
        setRemoveProductId(null);
    };

    const cancelRemove = () => {
        setShowRemoveModal(false);
        setRemoveProductId(null);
    };

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity > 0) {
            dispatch(updateCartItem(productId, newQuantity));
        } else if (newQuantity === 0) {
            handleRemoveFromCart(productId);
        }
    };

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = '/images/no_preview_image.png';
    };

    return (
        <div className="cart-page-container">
            <Container className="py-4">
                <h2 className="page-title">Shopping Cart</h2>

                {loading && (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <span>Loading cart...</span>
                    </div>
                )}

                {error && (
                    <Message variant="danger">
                        {error}
                    </Message>
                )}

                {!loading && !error && (
                    <>
                        {totalItems === 0 ? (
                            <div className="empty-cart">
                                <div className="empty-cart-icon">🛒</div>
                                <h3>Your cart is empty</h3>
                                <p>Start shopping to add items to your cart</p>
                                <Link to="/">
                                    <button className="browse-products-btn gradient-btn">
                                        Browse Products
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <Row>
                                <Col lg={8}>
                                    <div className="cart-items-section">
                                        {items.map((item) => (
                                            <div key={item.product.id} className="cart-item-card glassmorphism">
                                                <div className="cart-item-content">
                                                    <div className="item-image">
                                                        <img
                                                            src={item.product.image}
                                                            alt={item.product.name}
                                                            onError={handleImageError}
                                                        />
                                                    </div>
                                                    <div className="item-details">
                                                        <h4 className="item-name">{item.product.name}</h4>
                                                        <p className="item-price">₹ {parseFloat(item.product.price || 0).toFixed(2)}</p>
                                                    </div>
                                                    <div className="quantity-controls">
                                                        <CustomTooltip
                                                            text={item.quantity <= 1 ? "Minimum quantity is 1" : "Decrease quantity"}
                                                        >
                                                            <button
                                                                className="quantity-btn"
                                                                disabled={item.quantity <= 1}
                                                                onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                                                            >
                                                                −
                                                            </button>
                                                        </CustomTooltip>
                                                        <span className="quantity-display">{item.quantity}</span>
                                                        <CustomTooltip text="Increase quantity">
                                                            <button
                                                                className="quantity-btn"
                                                                onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                                                            >
                                                                +
                                                            </button>
                                                        </CustomTooltip>
                                                    </div>
                                                    <div className="item-actions">
                                                        <CustomTooltip text="Remove item from cart">
                                                            <button
                                                                className="remove-btn"
                                                                onClick={() => handleRemoveFromCart(item.product.id)}
                                                            >
                                                                🗑️
                                                            </button>
                                                        </CustomTooltip>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Col>
                                <Col lg={4}>
                                    <div className="cart-summary-card glassmorphism">
                                        <h3 className="summary-title">Cart Summary</h3>
                                        <div className="summary-divider"></div>
                                        <div className="summary-item">
                                            <span>Total Items:</span>
                                            <span className="summary-value">{totalItems}</span>
                                        </div>
                                        <div className="summary-item">
                                            <span>Total Price:</span>
                                            <span className="summary-price">₹ {totalPrice.toFixed(2)}</span>
                                        </div>
                                        <Link to="/cartcheckout">
                                            <button className="checkout-btn gradient-btn">
                                                Proceed to Checkout
                                            </button>
                                        </Link>
                                    </div>
                                </Col>
                            </Row>
                        )}
                    </>
                )}

                {/* Remove confirmation modal */}
                <div className={`modal-overlay ${showRemoveModal ? 'active' : ''}`}>
                    <div className="modal-container glassmorphism">
                        <div className="modal-header">
                            <h3>Confirm Remove</h3>
                            <button className="close-btn" onClick={cancelRemove}>×</button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to remove this item from your cart?
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={cancelRemove}>
                                Cancel
                            </button>
                            <button className="btn-danger" onClick={confirmRemove}>
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default CartPage;
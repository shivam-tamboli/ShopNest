import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    deleteProduct, 
    getProductDetails 
} from "../actions/productActions";
import { 
    addToCart, 
    getCart
} from "../actions/cartActions";
import Message from "../components/Message";
import { Link } from "react-router-dom";
import {
    CREATE_PRODUCT_RESET,
    DELETE_PRODUCT_RESET,
    UPDATE_PRODUCT_RESET,
    CARD_CREATE_RESET,
} from "../constants";
import "../styles/product-details.css";

function ProductDetailsPage({ history, match }) {
    const dispatch = useDispatch();

    // modal state
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // product details reducer
    const productDetailsReducer = useSelector(
        (state) => state.productDetailsReducer
    );
    const { loading, error, product } = productDetailsReducer;

    // login reducer
    const userLoginReducer = useSelector((state) => state.userLoginReducer);
    const { userInfo } = userLoginReducer;

    // delete product reducer
    const deleteProductReducer = useSelector(
        (state) => state.deleteProductReducer
    );
    const { success: productDeletionSuccess } = deleteProductReducer;

    // cart reducer
    const cartReducer = useSelector((state) => state.cartReducer);
    const { loading: cartLoading } = cartReducer;

    // Local state to show success message
    const [showCartSuccess, setShowCartSuccess] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        dispatch(getProductDetails(match.params.id));
        dispatch({ type: UPDATE_PRODUCT_RESET });
        dispatch({ type: CREATE_PRODUCT_RESET });
        dispatch({ type: CARD_CREATE_RESET });
    }, [dispatch, match]);

    // Handle cart success with local state instead of reducer reset
    useEffect(() => {
        if (showCartSuccess) {
            alert("✅ Product added to cart successfully!");
            setShowCartSuccess(false);
        }
    }, [showCartSuccess]);

    // confirm product deletion
    const confirmDelete = () => {
        dispatch(deleteProduct(match.params.id));
        handleClose();
    };

    // add to cart handler
    const handleAddToCart = async () => {
        if (!userInfo) {
            history.push('/login');
            return;
        }

        try {
            setShowCartSuccess(false);
            await dispatch(addToCart(product.id, quantity));
            setShowCartSuccess(true);
            dispatch(getCart());
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert(`Failed to add to cart: ${error.message}`);
        }
    };

    // after deletion
    useEffect(() => {
        if (productDeletionSuccess) {
            alert("✅ Product successfully deleted.");
            history.push("/");
            dispatch({ type: DELETE_PRODUCT_RESET });
        }
    }, [productDeletionSuccess, history, dispatch]);

    // Mock images for gallery (you can replace with actual product.images)
    const productImages = product?.images || [product?.image];

    return (
        <div className="product-details-container">
            {/* Delete Confirmation Modal */}
            <div className={`modal-overlay ${show ? 'active' : ''}`}>
                <div className="modal-container glassmorphism">
                    <div className="modal-header">
                        <h3>
                            <i className="fas fa-exclamation-triangle" style={{ color: "red" }}></i> 
                            Delete Product
                        </h3>
                        <button className="close-btn" onClick={handleClose}>×</button>
                    </div>
                    <div className="modal-body">
                        Are you sure you want to delete <strong>{product?.name || "this product"}</strong>?
                    </div>
                    <div className="modal-footer">
                        <button className="btn-danger" onClick={confirmDelete}>
                            Confirm Delete
                        </button>
                        <button className="btn-secondary" onClick={handleClose}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>

            {/* REMOVED BREADCRUMB NAVIGATION */}

            {/* Loading / Error States */}
            {loading && (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <span>Loading product details...</span>
                </div>
            )}

            {error && <div className="error-message">{error}</div>}

            {product && (
                <div className="product-details-grid">
                    {/* Product Images Gallery */}
                    <div className="product-images-section">
                        <div className="main-image-container">
                            <img 
                                src={productImages[selectedImage]} 
                                alt={product.name}
                                className="main-product-image"
                            />
                            {/* Wishlist button can be added here */}
                            {/* <button className="wishlist-btn">♥</button> */}
                        </div>
                        
                        {/* Image Thumbnails */}
                        {productImages.length > 1 && (
                            <div className="image-thumbnails">
                                {productImages.map((image, index) => (
                                    <button
                                        key={index}
                                        className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        <img src={image} alt={`${product.name} view ${index + 1}`} />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Admin buttons */}
                        {userInfo?.admin && (
                            <div className="admin-actions">
                                <button className="btn-danger" onClick={handleShow}>
                                    Delete Product
                                </button>
                                <button 
                                    className="btn-primary"
                                    onClick={() => history.push(`/product-update/${product.id}/`)}
                                >
                                    Edit Product
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Product Information */}
                    <div className="product-info-section">
                        <div className="product-info-card">
                            <h1 className="product-title">{product.name}</h1>
                            
                            {/* Product Rating - You can add actual rating data */}
                            <div className="product-rating">
                                <div className="stars">
                                    {'★'.repeat(4)}{'☆'.repeat(1)}
                                </div>
                                <span className="rating-text">(24 reviews)</span>
                            </div>
                            
                            <div className="product-price">
                                <span className="current-price">₹ {product.price}</span>
                                {/* You can add original price and discount if available */}
                                {/* <span className="original-price">₹ 1999</span>
                                <span className="discount-badge">-20%</span> */}
                            </div>

                            <div className="product-description">
                                <p>{product.description}</p>
                            </div>

                            {/* Stock Status */}
                            <div className="stock-status">
                                <span className={`stock ${product.stock === true || product.stock === 'true' ? 'in-stock' : 'out-of-stock'}`}>
                                    {product.stock === true || product.stock === 'true' ? '✓ In Stock' : '✗ Out of Stock'}
                                </span>
                            </div>

                            {/* Quantity Selector */}
                            <div className="quantity-selector">
                                <label>Quantity:</label>
                                <div className="quantity-controls">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                                    <span>{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="action-buttons">
                                {product.stock === true || product.stock === 'true' ? (
                                    <>
                                        <button 
                                            className="add-to-cart-btn gradient-btn"
                                            onClick={handleAddToCart}
                                            disabled={cartLoading}
                                        >
                                            {cartLoading ? 'Adding...' : '🛒 Add to Cart'}
                                        </button>
                                        <Link to="/cart">
                                            <button className="view-cart-btn glassmorphism-btn">
                                                View Cart
                                            </button>
                                        </Link>
                                        <Link to={`/checkout/product/${product.id}`}>
                                            <button className="buy-now-btn gradient-btn">
                                                💳 Buy Now
                                            </button>
                                        </Link>
                                    </>
                                ) : (
                                    <div className="out-of-stock-message">
                                        Out of Stock!
                                    </div>
                                )}
                            </div>

                            {/* Product Meta */}
                            <div className="product-meta">
                                <div className="meta-item">
                                    <span className="meta-label">SKU:</span>
                                    <span>{product.id}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">Category:</span>
                                    <span>{product.category || 'General'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Product Tabs Section */}
            {product && (
                <div className="product-tabs-section">
                    <div className="tabs-container">
                        <div className="tabs-header">
                            <button className="tab active">Description</button>
                            <button className="tab">Specifications</button>
                            <button className="tab">Reviews (24)</button>
                            <button className="tab">Shipping & Returns</button>
                        </div>
                        
                        <div className="tab-content">
                            <div className="tab-panel active">
                                <h3>Product Description</h3>
                                <p>{product.fullDescription || product.description}</p>
                                {/* Add more detailed description here */}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Related Products Section - Placeholder */}
            <div className="related-products-section">
                <h2 className="section-title">You May Also Like</h2>
                <div className="related-products-placeholder">
                    <p>Related products section coming soon...</p>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailsPage;
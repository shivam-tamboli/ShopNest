import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    deleteProduct, 
    getProductDetails 
} from "../actions/productActions";
import { 
    addToCart, 
    getCart  // ADD THIS IMPORT
} from "../actions/cartActions";
import Message from "../components/Message";
import {
    Spinner,
    Row,
    Col,
    Container,
    Card,
    Button,
    Modal,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
    CREATE_PRODUCT_RESET,
    DELETE_PRODUCT_RESET,
    UPDATE_PRODUCT_RESET,
    CARD_CREATE_RESET,
} from "../constants";

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

    // Use the consolidated cart reducer instead of cartAddReducer
    const cartReducer = useSelector((state) => state.cartReducer);
    const { loading: cartLoading } = cartReducer;

    // Local state to show success message
    const [showCartSuccess, setShowCartSuccess] = useState(false);

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
    // add to cart handler - FIXED VERSION
const handleAddToCart = async () => {
    if (!userInfo) {
        history.push('/login');
        return;
    }

    try {
        // Show loading state immediately
        setShowCartSuccess(false);
        
        // Wait for the addToCart action to complete
        await dispatch(addToCart(product.id));
        
        // Show success message
        setShowCartSuccess(true);
        
        // Optional: Refresh cart data
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

    return (
        <div>
            {/* Delete Confirmation Modal */}
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i
                            className="fas fa-exclamation-triangle"
                            style={{ color: "red" }}
                        ></i>{" "}
                        Delete Product
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete{" "}
                    <strong>{product?.name || "this product"}</strong>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={confirmDelete}>
                        Confirm Delete
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Loading / Error / Product */}
            {loading && (
                <div className="d-flex justify-content-center align-items-center my-5">
                    <Spinner animation="border" variant="primary" className="mr-2" />
                    <span>Loading product details...</span>
                </div>
            )}

            {error && <Message variant="danger">{error}</Message>}

            {product && (
                <Container className="my-4">
                    <Row className="shadow-lg p-3 rounded bg-white">
                        {/* Product Image */}
                        <Col md={5} className="mb-3">
                            <Card className="shadow-sm border-0">
                                <Card.Img
                                    variant="top"
                                    src={product.image}
                                    alt={product.name}
                                    style={{ height: "420px", objectFit: "cover" }}
                                />
                            </Card>

                            {/* Admin buttons */}
                            {userInfo?.admin && (
                                <div className="d-flex mt-3">
                                    <Button
                                        variant="danger"
                                        className="w-50 mr-2"
                                        onClick={handleShow}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        variant="primary"
                                        className="w-50"
                                        onClick={() =>
                                            history.push(`/product-update/${product.id}/`)
                                        }
                                    >
                                        Edit
                                    </Button>
                                </div>
                            )}
                        </Col>

                        {/* Product Details */}
                        <Col md={4} className="mb-3">
                            <h3 className="fw-bold">{product.name}</h3>
                            
                            {/* ADDED BADGES SECTION */}
                            <div className="product-badges mb-2">
                                {product.is_new && (
                                    <span className="badge bg-success me-1">New</span>
                                )}
                                {product.is_hot && (
                                    <span className="badge bg-danger me-1">Hot</span>
                                )}
                                {product.is_popular && (
                                    <span className="badge bg-warning text-dark me-1">Popular</span>
                                )}
                            </div>
                            
                            <hr />
                            <p className="text-muted">{product.description}</p>
                            <div
                                className="p-2 rounded text-center"
                                style={{
                                    border: "1px solid #C6ACE7",
                                    fontSize: "1.1rem",
                                    fontWeight: "bold",
                                }}
                            >
                                Price: <span className="text-success">₹ {product.price}</span>
                            </div>
                        </Col>

                        {/* Buy Section */}
                        <Col md={3} className="text-center">
                            <h4 className="fw-bold">Buy</h4>
                            <hr />
                            {product.stock === true || product.stock === 'true' ? (
                                <>
                                    <Button
                                        variant="primary"
                                        className="w-100 py-2 mb-2"
                                        onClick={handleAddToCart}
                                        disabled={cartLoading}
                                    >
                                        {cartLoading ? 'Adding...' : '🛒 Add to Cart'}
                                    </Button>
                                    <Link to="/cart">
                                        <Button variant="outline-primary" className="w-100 py-2 mb-2">
                                            View Cart
                                        </Button>
                                    </Link>
                                    <Link to={`/checkout/product/${product.id}`}>
                                        <Button variant="success" className="w-100 py-2">
                                            💳 Buy Now
                                        </Button>
                                    </Link>
                                </>
                            ) : (
                                <Message variant="danger">Out of Stock!</Message>
                            )}
                        </Col>
                    </Row>
                </Container>
            )}
        </div>
    );
}

export default ProductDetailsPage;
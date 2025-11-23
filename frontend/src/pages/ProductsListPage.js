import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProductsList } from '../actions/productActions'
import Message from '../components/Message'
import { Spinner, Row, Col, Container } from 'react-bootstrap'
import Product from '../components/Product'
import { useLocation } from "react-router-dom";
import { CREATE_PRODUCT_RESET } from '../constants'
import ModernHero from '../components/ModernHero'

function ProductsListPage() {
    const location = useLocation();
    const dispatch = useDispatch();

    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search") || "";

    const productsListReducer = useSelector(state => state.productsListReducer);
    const { loading, error, products } = productsListReducer;

    useEffect(() => {
        dispatch(getProductsList());
        dispatch({ type: CREATE_PRODUCT_RESET });
    }, [dispatch]);

    const filteredProducts = products.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const showNothingMessage = () => (
        <div className="text-center mt-5">
            {!loading && <Message variant='info'>No products found</Message>}
        </div>
    );

    return (
        <div>
            {/* Modern Hero Section */}
            <ModernHero />
            
            {/* Products Section */}
            <Container className="mt-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold text-primary">Our Products</h2>
                </div>

                {error && <Message variant='danger'>{error}</Message>}

                {loading ? (
                    <div className="d-flex justify-content-center align-items-center mt-5">
                        <Spinner animation="border" variant="primary" />
                        <h5 className="ms-2">Loading products...</h5>
                    </div>
                ) : (
                    <Row>
                        {filteredProducts.length === 0 ? (
                            showNothingMessage()
                        ) : (
                            filteredProducts.map((product) => (
                                <Col key={product.id} sm={12} md={6} lg={4} xl={3} className="mb-4">
                                    <Product product={product} />
                                </Col>
                            ))
                        )}
                    </Row>
                )}
            </Container>
        </div>
    );
}

export default ProductsListPage;
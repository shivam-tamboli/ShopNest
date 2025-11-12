import React, { useState, useEffect } from 'react'
import { Form, Button, Badge } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Spinner } from 'react-bootstrap'
import { getProductDetails, updateProduct } from '../actions/productActions'
import { checkTokenValidation, logout } from '../actions/userActions'
import { UPDATE_PRODUCT_RESET } from '../constants'
import Message from '../components/Message'

const ProductUpdatePage = ({ match }) => {
    const productDetailsReducer = useSelector(state => state.productDetailsReducer)
    const { loading: loadingPageDetails, product } = productDetailsReducer

    // State initialization
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [stock, setStock] = useState(false)
    const [image, setImage] = useState("")
    const [category, setCategory] = useState("")
    const [isNew, setIsNew] = useState(false)
    const [isPopular, setIsPopular] = useState(false)

    let history = useHistory()
    const dispatch = useDispatch()

    const [newImage, setNewImage] = useState(false)

    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    const updateProductReducer = useSelector(state => state.updateProductReducer)
    const {
        success: productUpdationSuccess,
        loading: loadingProductUpdations,
        error: productUpdationError
    } = updateProductReducer

    const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
    const { error: tokenError } = checkTokenValidationReducer
    
    // Get product details
    useEffect(() => {
        if (!userInfo || !userInfo.admin) {
            history.push("/login")
            return
        }
        dispatch(checkTokenValidation())
        dispatch(getProductDetails(match.params.id))
    }, [dispatch, userInfo, history, match])

    // Update form fields when product data loads
    useEffect(() => {
        if (product && product.id) {
            setName(product.name || "")
            setDescription(product.description || "")
            setPrice(product.price ? product.price.toString() : "")
            setStock(product.stock || false)
            setCategory(product.category || "")
            setIsNew(product.is_new || false)
            setIsPopular(product.is_popular || false)
        }
    }, [product])

    const onSubmit = (e) => {
        e.preventDefault()
        
        if (!product || !product.id) {
            alert("Product data not loaded yet")
            return
        }
    
        const productId = product.id
        let form_data = new FormData()
        form_data.append('name', name)
        form_data.append('description', description)
        form_data.append('price', parseFloat(price) || 0)
        form_data.append('stock', stock)
        form_data.append('category', category)
        form_data.append('is_new', isNew)
        form_data.append('is_popular', isPopular)
        
        // ONLY append image if a new one was selected
        if (image && image !== "") {
            form_data.append('image', image)
        }
    
        dispatch(updateProduct(productId, form_data))
    }

    useEffect(() => {
        if (productUpdationSuccess) {
            alert("Product successfully updated.")
            dispatch({ type: UPDATE_PRODUCT_RESET })
            history.push(`/product/${product.id}`)
        }
    }, [productUpdationSuccess, dispatch, history, product])

    useEffect(() => {
        if (userInfo && tokenError === "Request failed with status code 401") {
            alert("Session expired, please login again.")
            dispatch(logout())
            history.push("/login")
            window.location.reload()
        }
    }, [tokenError, userInfo, dispatch, history])

    const renderError = () => {
        if (!productUpdationError) return "";
        
        let errorMessage = "";
        
        if (typeof productUpdationError === 'object') {
            if (productUpdationError.image && Array.isArray(productUpdationError.image)) {
                errorMessage = productUpdationError.image[0];
            } else if (productUpdationError.detail) {
                errorMessage = productUpdationError.detail;
            } else {
                errorMessage = JSON.stringify(productUpdationError);
            }
        } else if (typeof productUpdationError === 'string') {
            errorMessage = productUpdationError;
        }
        
        if (errorMessage) {
            setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
            return <Message variant='danger'>{errorMessage}</Message>;
        }
        
        return "";
    }

    return (
        <div className="container mt-4">
            <h2 className="text-center text-primary mb-4">
                <em>Edit Product</em>
            </h2>
            
            {renderError()}
            
            {loadingPageDetails && (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                    <h5 className="mt-2">Loading Product Details...</h5>
                </div>
            )}
            
            {loadingProductUpdations && (
                <div className="text-center">
                    <Spinner animation="border" variant="success" />
                    <h5 className="mt-2">Updating Product...</h5>
                </div>
            )}
            
            {product && product.id && (
                <Form onSubmit={onSubmit} className="bg-light p-4 rounded">
                    <Form.Group controlId='image' className="mb-3">
                        <Form.Label>
                            <b>Product Image</b>
                        </Form.Label>
                        {product.image && (
                            <p>
                                <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    height="200" 
                                    className="img-thumbnail"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </p>
                        )}

                        {newImage ? (
                            <div>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImage(e.target.files[0])}
                                />
                                <Button
                                    variant="secondary"
                                    className="mt-2"
                                    onClick={() => {
                                        setNewImage(false);
                                        setImage("");
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        ) : (
                            <Button
                                variant="success"
                                onClick={() => setNewImage(true)}
                            >
                                Choose Different Image
                            </Button>
                        )}
                    </Form.Group>

                    <Form.Group controlId='name' className="mb-3">
                        <Form.Label><b>Product Name</b></Form.Label>
                        <Form.Control
                            autoFocus={true}
                            type="text"
                            value={name}
                            placeholder="Product name"
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId='description' className="mb-3">
                        <Form.Label><b>Product Description</b></Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={description}
                            placeholder="Product description"
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId='price' className="mb-3">
                        <Form.Label><b>Price (INR)</b></Form.Label>
                        <Form.Control
                            type="number"
                            step="0.01"
                            min="0"
                            value={price}
                            placeholder="199.99"
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId='category' className="mb-3">
                        <Form.Label><b>Category</b></Form.Label>
                        <Form.Control
                            type="text"
                            value={category}
                            placeholder="Electronics, Clothing, Decor, etc."
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        />
                    </Form.Group>

                    {/* Stock Status */}
                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="In Stock"
                            checked={stock}
                            onChange={(e) => setStock(e.target.checked)}
                        />
                    </Form.Group>

                    {/* Badge Management */}
                    <div className="mb-4 p-3 border rounded">
                        <h6 className="fw-bold mb-3">Product Badges</h6>
                        
                        <Form.Group className="mb-2">
                            <Form.Check
                                type="checkbox"
                                label={
                                    <>
                                        <Badge bg="success" className="me-2">New</Badge>
                                        Mark as New Product
                                    </>
                                }
                                checked={isNew}
                                onChange={(e) => setIsNew(e.target.checked)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Check
                                type="checkbox"
                                label={
                                    <>
                                        <Badge bg="danger" className="me-2">Popular</Badge>
                                        Mark as Popular Product
                                    </>
                                }
                                checked={isPopular}
                                onChange={(e) => setIsPopular(e.target.checked)}
                            />
                        </Form.Group>
                    </div>

                    <div className="d-flex gap-2">
                        <Button
                            type="submit"
                            variant='success'
                            className="btn-sm"
                            disabled={loadingProductUpdations}
                        >
                            {loadingProductUpdations ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                            onClick={() => history.push(`/product/${product.id}`)}
                            variant='secondary'
                            className="btn-sm"
                        >
                            Cancel
                        </Button>
                    </div>
                </Form>
            )}
        </div>
    )
}

export default ProductUpdatePage
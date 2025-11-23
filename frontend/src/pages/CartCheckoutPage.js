import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Row, Col, Container, Spinner, Image } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import CreateCardComponent from '../components/CreateCardComponent'
import ChargeCardComponent from '../components/ChargeCardComponent'
import Message from '../components/Message'
import { savedCardsList } from '../actions/cardActions'
import UserAddressComponent from '../components/UserAddressComponent'
import { checkTokenValidation, logout } from '../actions/userActions'
import { CHARGE_CARD_RESET } from '../constants/index'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { getCart } from '../actions/cartActions'
import '../styles/checkout.css';

// Enhanced Stripe initialization with debugging
let stripePromise = null

const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
    
    if (!publishableKey) {
      console.error('❌ Stripe Publishable Key is missing!')
      return null
    }

    try {
      stripePromise = loadStripe(publishableKey, {
        betas: [],
      })
    } catch (error) {
      console.error('❌ Error initializing Stripe:', error)
      return null
    }
  }
  return stripePromise
}

const CartCheckoutPage = () => {
  const history = useHistory()
  const dispatch = useDispatch()

  const [addressSelected, setAddressSelected] = useState(false)
  const [selectedAddressId, setSelectedAddressId] = useState(0)
  const [stripeReady, setStripeReady] = useState(false)
  const [stripeError, setStripeError] = useState(null)

  // Initialize Stripe
  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await getStripe()
        
        if (!stripeInstance) {
          throw new Error('Failed to load Stripe.js - check your publishable key')
        }
        
        setStripeReady(true)
      } catch (error) {
        setStripeError(error.message)
      }
    }

    initializeStripe()
  }, [])

  const handleAddressId = (id) => {
    if (id) setAddressSelected(true)
    setSelectedAddressId(id)
  }

  // reducers
  const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
  const { error: tokenError } = checkTokenValidationReducer

  const cartReducer = useSelector(state => state.cartReducer)
  const { loading, error, cart } = cartReducer

  const createCardReducer = useSelector(state => state.createCardReducer)
  const { error: cardCreationError, success, loading: cardCreationLoading } = createCardReducer

  const userLoginReducer = useSelector(state => state.userLoginReducer)
  const { userInfo } = userLoginReducer

  const savedCardsListReducer = useSelector(state => state.savedCardsListReducer)
  const { stripeCards } = savedCardsListReducer

  useEffect(() => {
    if (!userInfo) {
      history.push("/login")
    } else {
      dispatch(checkTokenValidation())
      dispatch(getCart())
      dispatch(savedCardsList())
      dispatch({ type: CHARGE_CARD_RESET })
    }
  }, [dispatch, history, success, userInfo])

  // Token expiration handling
  useEffect(() => {
    if (userInfo && tokenError === "Request failed with status code 401") {
      alert("Session expired, please login again.")
      dispatch(logout())
      history.push("/login")
      window.location.reload()
    }
  }, [userInfo, tokenError, dispatch, history])

  const items = cart?.items || []
  const totalPrice = items.reduce((acc, item) => acc + (parseFloat(item.product.price) * item.quantity), 0)
  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0)

  // Show loading state while Stripe initializes
  if (!stripeReady && !stripeError) {
    return (
      <div className="checkout-page-container">
        <Container className="py-4">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <span>Initializing payment system...</span>
          </div>
        </Container>
      </div>
    )
  }

  // Show error state if Stripe failed to load
  if (stripeError) {
    return (
      <div className="checkout-page-container">
        <Container className="py-4">
          <Message variant='danger'>
            <h4>Payment System Unavailable</h4>
            <p>{stripeError}</p>
          </Message>
        </Container>
      </div>
    )
  }

  return (
    <div className="checkout-page-container">
      <Container className="py-4">
        {cardCreationError && <Message variant='danger'>{cardCreationError}</Message>}

        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <span>Fetching Checkout Info...</span>
          </div>
        )}

        {!loading && cardCreationLoading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <span>Validating Card Details...</span>
          </div>
        )}

        {error && <Message variant='danger'>{error}</Message>}

        {cart && items.length > 0 && (
          <Row>
            {/* Left Column - Checkout Summary */}
            <Col lg={6} className="mb-4">
              <div className="checkout-section">
                <h1 className="main-title">Cart Checkout Summary</h1>

                {/* Product Items with Images */}
                {items.map((item, index) => (
                  <div key={index} className="product-item">
                    <div className="product-header">
                      {item.product?.image ? (
                        <Image
                          src={item.product.image}
                          alt={item.product?.name || "Product"}
                          className="product-image"
                          fluid
                        />
                      ) : (
                        <div className="product-image-placeholder">
                          <span>No Image</span>
                        </div>
                      )}
                      <div className="product-info">
                        <h3 className="product-title">{item.product?.name || "Unnamed Product"}</h3>
                        <div className="product-details">
                          <span className="quantity">Quantity: {item.quantity}</span>
                          <span className="price">¥ {item.product?.price || 0}</span>
                        </div>
                      </div>
                    </div>
                    <hr className="section-divider" />
                  </div>
                ))}

                {/* Address Section */}
                <div className="address-section">
                  <div className="section-header">
                    <h2 className="section-title">Billing Address</h2>
                    <Link to="/all-addresses/" className="edit-link">Edit/Add</Link>
                  </div>
                  <p className="instruction-text">Please select a billing address to proceed with payment.</p>
                  <UserAddressComponent handleAddressId={handleAddressId} />
                </div>
              </div>
            </Col>

            {/* Right Column - Payments Section */}
            <Col lg={6}>
              <div className="payments-section">
                <h1 className="main-title">Payments Section</h1>
                
                {!addressSelected && (
                  <div className="warning-message">
                    <span>⚠️ Please select a billing address to proceed with payment.</span>
                  </div>
                )}

                {/* First Order Summary - Detailed Breakdown */}
                <div className="order-summary">
                  <h3 className="summary-title">Order Summary</h3>
                  <div className="summary-line">
                    <span>Items ({totalItemsCount}):</span>
                    <span>¥ {totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="summary-line">
                    <span>Shipping:</span>
                    <span>¥ 0.00</span>
                  </div>
                  <div className="summary-line">
                    <span>Tax:</span>
                    <span>¥ 0.00</span>
                  </div>
                  <hr className="section-divider" />
                  <div className="summary-total">
                    <strong>Total:</strong>
                    <strong>¥ {totalPrice.toFixed(2)}</strong>
                  </div>
                </div>

                {/* Second Order Summary - Itemized List */}
                <div className="order-summary">
                  <h3 className="summary-title">Order Summary</h3>
                  {items.map((item, index) => (
                    <div key={index} className="summary-line">
                      <span>{item.quantity} x {item.product?.name || "Unnamed Product"}</span>
                      <span>¥ {(parseFloat(item.product?.price) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <hr className="section-divider" />
                  <div className="summary-total">
                    <strong>Total:</strong>
                    <strong>¥ {totalPrice.toFixed(2)}</strong>
                  </div>
                </div>

                {/* Saved Card Section */}
                <div className="saved-card-section">
                  <h3 className="section-title">Saved card</h3>
                  <div className="card-info">
                    <p className="card-number"><strong>Card Number:</strong> XXXX XXXX XXXX 4242</p>
                    <div className="card-actions">
                      <button className="btn btn-outline">Show Card Details</button>
                      <button className="btn btn-primary">Pay ¥{totalPrice.toFixed(2)}</button>
                    </div>
                  </div>
                </div>

                {/* Payment Component */}
                <div className={`payment-component ${!addressSelected ? 'disabled' : ''}`}>
                  {success ? (
                    <ChargeCardComponent
                      selectedAddressId={selectedAddressId}
                      addressSelected={addressSelected}
                      checkoutData={{
                        type: 'cart',
                        items: items,
                        total: totalPrice
                      }}
                    />
                  ) : (
                    <Elements stripe={getStripe()}>
                      <CreateCardComponent
                        addressSelected={addressSelected}
                        stripeCards={stripeCards || []}
                        checkoutData={{
                          type: 'cart',
                          items: items,
                          total: totalPrice
                        }}
                      />
                    </Elements>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        )}

        {cart && items.length === 0 && !loading && (
          <div className="empty-cart-message">
            <h3>Your cart is empty</h3>
            <p>Add some products to your cart before checkout.</p>
            <Link to="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        )}
      </Container>
    </div>
  )
}

export default CartCheckoutPage
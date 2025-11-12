import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Row, Col, Container, Image, Card, Spinner } from 'react-bootstrap'
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

// Enhanced Stripe initialization with debugging (same as above)
let stripePromise = null

const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
    
    console.log('🔧 Stripe Debug - Publishable Key:', publishableKey ? 'Present' : 'MISSING')
    
    if (!publishableKey) {
      console.error('❌ Stripe Publishable Key is missing!')
      return null
    }

    if (!publishableKey.startsWith('pk_test_') && !publishableKey.startsWith('pk_live_')) {
      console.error('❌ Invalid Stripe Publishable Key format:', publishableKey)
      return null
    }

    try {
      stripePromise = loadStripe(publishableKey, {
        betas: [], // Disable any beta features that might cause issues
      })
      console.log('✅ Stripe initialized successfully')
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
        console.log('🔄 Initializing Stripe...')
        const stripeInstance = await getStripe()
        
        if (!stripeInstance) {
          throw new Error('Failed to load Stripe.js - check your publishable key')
        }
        
        setStripeReady(true)
        console.log('✅ Stripe is ready!')
      } catch (error) {
        console.error('❌ Stripe initialization failed:', error)
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
      dispatch(getCart()) // Load cart data
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

  // Show loading state while Stripe initializes
  if (!stripeReady && !stripeError) {
    return (
      <Container className="py-4">
        <div className="d-flex justify-content-center align-items-center my-5">
          <Spinner animation="border" />
          <h5 className="ml-3">Initializing payment system...</h5>
        </div>
      </Container>
    )
  }

  // Show error state if Stripe failed to load
  if (stripeError) {
    return (
      <Container className="py-4">
        <Message variant='danger'>
          <h4>Payment System Unavailable</h4>
          <p>{stripeError}</p>
          <p className="mb-0">
            Please check your internet connection and try again. 
            If the problem persists, contact support.
          </p>
        </Message>
      </Container>
    )
  }

  const items = cart?.items || []
  const totalPrice = items.reduce((acc, item) => acc + (parseFloat(item.product.price) * item.quantity), 0)

  return (
    <Container className="py-4">
      {cardCreationError && <Message variant='danger'>{cardCreationError}</Message>}

      {loading && (
        <div className="d-flex justify-content-center align-items-center my-5">
          <Spinner animation="border" />
          <h5 className="ml-3">Fetching Checkout Info...</h5>
        </div>
      )}

      {!loading && cardCreationLoading && (
        <div className="d-flex justify-content-center align-items-center my-5">
          <Spinner animation="border" />
          <h5 className="ml-3">Validating Card Details...</h5>
        </div>
      )}

      {error && <Message variant='danger'>{error}</Message>}

      {cart && (
        <Row>
          {/* Checkout Summary */}
          <Col md={6} className="mb-4">
            <h3 className="mb-3">Cart Checkout Summary</h3>

            {items.map((item, index) => (
              <Card key={index} className="shadow-sm mb-3">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col xs={5}>
                      {item.product?.image ? (
                        <Image
                          src={item.product.image}
                          alt={item.product?.name || "Product"}
                          fluid
                          rounded
                          className="border"
                          style={{ height: "100px", objectFit: "cover" }}
                        />
                      ) : (
                        <div className="border bg-light d-flex justify-content-center align-items-center" style={{ height: "100px", width: "100px" }}>
                          <span>No Image</span>
                        </div>
                      )}
                    </Col>
                    <Col xs={7}>
                      <h6 className="text-capitalize">{item.product?.name || "Unnamed Product"}</h6>
                      <p>Quantity: {item.quantity}</p>
                      <span className="text-success">₹ {item.product?.price || 0}</span>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}

            <Card className="shadow-sm mt-3">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h4>Billing Address</h4>
                  <Link to="/all-addresses/" aria-label="Edit or add billing address">Edit/Add</Link>
                </div>
                <UserAddressComponent handleAddressId={handleAddressId} />
              </Card.Body>
            </Card>
          </Col>

          {/* Payments Section */}
          <Col md={6}>
            <h3 className="mb-3">Payments Section</h3>
            {!addressSelected && (
              <Message variant='warning' aria-live="polite">
                Please select a billing address to proceed with payment.
              </Message>
            )}

            <Card className="shadow-sm mb-3">
              <Card.Body>
                <h5>Order Summary</h5>
                <hr />
                <div className="d-flex justify-content-between mb-2">
                  <span>Items ({items.length}):</span>
                  <span>₹ {totalPrice.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <span>₹ 0.00</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax:</span>
                  <span>₹ 0.00</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total:</strong>
                  <strong>₹ {totalPrice.toFixed(2)}</strong>
                </div>
              </Card.Body>
            </Card>

            <Card className="shadow-sm" aria-disabled={!addressSelected}>
              <Card.Body>
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
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  )
}

export default CartCheckoutPage
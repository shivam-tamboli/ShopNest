import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Button, Spinner, Modal } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
    userDetails,
    logout,
    checkTokenValidation,
    getAllAddress,
    deleteUserAddress
} from '../actions/userActions'
import { DELETE_USER_ADDRESS_RESET, GET_SINGLE_ADDRESS_RESET } from '../constants'
import Message from '../components/Message'
import CreateAddressComponent from '../components/CreateAddressComponent'

function AccountPage() {
    let history = useHistory()
    const dispatch = useDispatch()

    // State for address
    const [deleteAddress, setDeleteAddress] = useState("")
    const [createAddress, setCreateAddress] = useState(false)
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    // Token validation
    const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
    const { error: tokenError } = checkTokenValidationReducer

    // Login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // Profile reducer
    const userDetailsReducer = useSelector(state => state.userDetailsReducer)
    const { user: userAccDetails, loading } = userDetailsReducer

    // Address reducer
    const getAllAddressesOfUserReducer = useSelector(state => state.getAllAddressesOfUserReducer)
    const { addresses, loading: loadingAllAddresses } = getAllAddressesOfUserReducer

    const deleteUserAddressReducer = useSelector(state => state.deleteUserAddressReducer)
    const { success: addressDeletionSuccess } = deleteUserAddressReducer

    useEffect(() => {
        if (!userInfo) {
            history.push("/login")
        } else {
            try {
                dispatch(checkTokenValidation())
                dispatch(userDetails(userInfo.id))
                dispatch(getAllAddress())
                dispatch({ type: GET_SINGLE_ADDRESS_RESET })
            } catch (error) {
                history.push("/")
            }
        }
    }, [history, userInfo, dispatch, addressDeletionSuccess])

    const logoutHandler = () => {
        dispatch(logout())
    }

    if (userInfo && tokenError === "Request failed with status code 401") {
        alert("Session expired, please login again.")
        dispatch(logout())
        history.push("/login")
        window.location.reload()
    }

    if (addressDeletionSuccess) {
        alert("Address successfully deleted.")
        dispatch({ type: DELETE_USER_ADDRESS_RESET })
        dispatch(getAllAddress())
    }

    // Delete address
    const deleteAddressHandler = (address) => {
        setDeleteAddress(address)
        handleShow()
    }

    const confirmDelete = (id) => {
        dispatch(deleteUserAddress(id))
        handleClose()
    }

    // FIXED: Moved state update to a proper handler
    const toggleCreateAddress = () => {
        setCreateAddress(prevState => !prevState)
    }

    return (
        <Container className="d-flex justify-content-center mt-5">
            <Col xs={12} md={10} lg={8}>
                <Card className="shadow-lg border-0 rounded-4 frosted-card">
                    <Card.Body className="p-4">

                        {/* Profile Section */}
                        <h2 className="text-center mb-4 fw-bold text-primary">My Account</h2>
                        {loading ? (
                            <div className="d-flex justify-content-center align-items-center">
                                <Spinner animation="border" />
                                <span className="ml-2">Getting User Information...</span>
                            </div>
                        ) : userAccDetails ? (
                            <>
                                <Row className="mb-3">
                                    <Col xs={4} className="fw-bold text-muted">Name:</Col>
                                    <Col className="text-dark">{userAccDetails.username}</Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col xs={4} className="fw-bold text-muted">Email:</Col>
                                    <Col className="text-dark">{userAccDetails.email}</Col>
                                </Row>
                                <div className="d-flex justify-content-between mt-4 gap-2">
                                    <Link to={`/account/update`}>
                                        <Button variant="warning" className="px-4 rounded-pill">Update</Button>
                                    </Link>
                                    <Link to={`/account/delete/`}>
                                        <Button variant="danger" className="px-4 rounded-pill">Delete</Button>
                                    </Link>
                                    <Button
                                        variant="secondary"
                                        onClick={logoutHandler}
                                        className="px-4 rounded-pill"
                                    >
                                        Logout
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <Message variant="danger">
                                Something went wrong, go back to{" "}
                                <Link onClick={logoutHandler} to={`/login`}>Login</Link> page.
                            </Message>
                        )}

                        <hr className="my-4" />

                        {/* Address Section */}
                        <h3 className="mb-3 fw-semibold text-primary">My Addresses</h3>

                        {loadingAllAddresses && (
                            <div className="d-flex align-items-center mb-3">
                                <h6 className="mb-0">Getting addresses</h6>
                                <Spinner animation="border" className="ms-2" />
                            </div>
                        )}

                        {createAddress ? (
                            <CreateAddressComponent toggleCreateAddress={toggleCreateAddress} />
                        ) : (
                            <Button
                                variant="primary"
                                size="sm"
                                className="mb-3"
                                onClick={toggleCreateAddress} // FIXED: Direct handler
                            >
                                Add new address +
                            </Button>
                        )}

                        {addresses && !createAddress && addresses.map((address, idx) => (
                            <Card
                                className="p-3 mb-3"
                                style={{ border: "1px solid", borderColor: "#C6ACE7" }}
                                key={address.id}
                            >
                                <span><b>Name:</b> {address.name}</span><br />
                                <span><b>Phone:</b> +91 {address.phone_number}</span><br />
                                <span><b>Address:</b> {address.house_no}, near {address.landmark}, {address.city}, {address.state}, {address.pin_code}</span>
                                <div className="mt-2">
                                    <i
                                        title="delete address"
                                        className="fas fa-trash-alt fa-lg text-danger me-3"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => deleteAddressHandler(address)}
                                    ></i>
                                    <i
                                        title="edit address"
                                        className="fas fa-edit fa-lg text-primary"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => history.push(`/all-addresses/${address.id}/`)}
                                    ></i>
                                </div>
                            </Card>
                        ))}

                        {/* Delete Confirmation Modal */}
                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>
                                    <i style={{ color: "#e6e600" }} className="fas fa-exclamation-triangle"></i>{" "}
                                    Delete Confirmation
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Are you sure you want to delete this address
                                {" "}<em>"{deleteAddress.house_no}, {deleteAddress.city}, {deleteAddress.state}"</em>?
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="danger" onClick={() => confirmDelete(deleteAddress.id)}>
                                    Confirm Delete
                                </Button>
                                <Button variant="secondary" onClick={handleClose}>
                                    Cancel
                                </Button>
                            </Modal.Footer>
                        </Modal>

                    </Card.Body>
                </Card>
            </Col>
        </Container>
    )
}

export default AccountPage
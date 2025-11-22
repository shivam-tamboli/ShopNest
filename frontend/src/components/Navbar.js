import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { logout } from "../actions/userActions";
import { useHistory } from "react-router-dom";
import SearchBarForProducts from "./SearchBarForProducts";
import "../styles/navbar.css";

function NavBar() {
    const history = useHistory();
    const dispatch = useDispatch();

    const userLoginReducer = useSelector((state) => state.userLoginReducer);
    const { userInfo } = userLoginReducer;

    const logoutHandler = () => {
        dispatch(logout());
        history.push("/login");
        window.location.reload();
    };

    return (
        <header>
            <Navbar expand="lg" className="custom-navbar shadow-sm">
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand className="brand-logo">
                            <i className="fas fa-shopping-bag me-2"></i> ShopNest
                        </Navbar.Brand>
                    </LinkContainer>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto align-items-center">

                            <LinkContainer to="/about">
                                <Nav.Link className="nav-link-custom">About</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/">
                                <Nav.Link className="nav-link-custom">All Products</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/electronics">
                                <Nav.Link className="nav-link-custom">Electronics</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/clothing">
                                <Nav.Link className="nav-link-custom">Clothing</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/decor">
                                <Nav.Link className="nav-link-custom">Decor</Nav.Link>
                            </LinkContainer>

                            {userInfo && (
                                <>
                                    <LinkContainer to="/cart">
                                        <Nav.Link className="nav-link-custom">
                                            <i className="fas fa-shopping-cart me-1"></i> Cart
                                        </Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/wishlist">
                                        <Nav.Link className="nav-link-custom">
                                            <i className="fas fa-heart me-1"></i> Wishlist
                                        </Nav.Link>
                                    </LinkContainer>
                                </>
                            )}

                            {userInfo && userInfo.admin && (
                                <LinkContainer to="/new-product/">
                                    <Nav.Link className="nav-link-custom">Add Product</Nav.Link>
                                </LinkContainer>
                            )}

                            <div className="search-container">
                                <SearchBarForProducts />
                            </div>
                        </Nav>

                        {userInfo ? (
                            <NavDropdown
                                className="text-capitalize nav-dropdown"
                                title={
                                    <span>
                                        <i className="fas fa-user-circle me-2"></i>
                                        {userInfo.username}
                                    </span>
                                }
                                id="username"
                            >
                                <LinkContainer to="/account">
                                    <NavDropdown.Item>Account Settings</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to="/stripe-card-details/">
                                    <NavDropdown.Item>Card Settings</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to="/all-orders/">
                                    <NavDropdown.Item>All Orders</NavDropdown.Item>
                                </LinkContainer>
                                <NavDropdown.Item
                                    onClick={logoutHandler}
                                    className="logout-btn"
                                >
                                    Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <LinkContainer to="/login">
                                <Nav.Link className="nav-link-custom login-btn">
                                    <i className="fas fa-sign-in-alt me-1"></i> Login
                                </Nav.Link>
                            </LinkContainer>
                        )}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
}

export default NavBar;
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
        <header className="modern-header">
            <Navbar expand="lg" className="modern-navbar">
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand className="modern-brand">
                            <div className="brand-icon">🛍️</div>
                            <span className="brand-text">ShopNest</span>
                        </Navbar.Brand>
                    </LinkContainer>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" className="nav-toggle" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto nav-links">
                            <LinkContainer to="/about">
                                <Nav.Link className="nav-link">About</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/products">
                                <Nav.Link className="nav-link">Products</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/electronics">
                                <Nav.Link className="nav-link">Electronics</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/clothing">
                                <Nav.Link className="nav-link">Clothing</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/decor">
                                <Nav.Link className="nav-link">Decor</Nav.Link>
                            </LinkContainer>

                            {userInfo && (
                                <>
                                    <LinkContainer to="/cart">
                                        <Nav.Link className="nav-link cart-link">
                                            <span className="nav-icon">🛒</span>
                                            Cart
                                        </Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/wishlist">
                                        <Nav.Link className="nav-link wishlist-link">
                                            <span className="nav-icon">❤️</span>
                                            Wishlist
                                        </Nav.Link>
                                    </LinkContainer>
                                </>
                            )}

                            {userInfo && userInfo.admin && (
                                <LinkContainer to="/new-product/">
                                    <Nav.Link className="nav-link">Add Product</Nav.Link>
                                </LinkContainer>
                            )}
                        </Nav>

                        <div className="nav-search">
                            <SearchBarForProducts />
                        </div>

                        {userInfo ? (
                            <div className="user-section">
                                <NavDropdown
                                    className="user-dropdown"
                                    title={
                                        <div className="user-avatar">
                                            <span className="avatar-icon">👤</span>
                                            <span className="username">{userInfo.username}</span>
                                            <span className="dropdown-arrow">⌄</span>
                                        </div>
                                    }
                                    id="username"
                                >
                                    <LinkContainer to="/account">
                                        <NavDropdown.Item className="dropdown-item">
                                            <span className="item-icon">⚙️</span>
                                            Account Settings
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/stripe-card-details/">
                                        <NavDropdown.Item className="dropdown-item">
                                            <span className="item-icon">💳</span>
                                            Card Settings
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/all-orders/">
                                        <NavDropdown.Item className="dropdown-item">
                                            <span className="item-icon">📦</span>
                                            All Orders
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item 
                                        onClick={logoutHandler}
                                        className="dropdown-item logout-item"
                                    >
                                        <span className="item-icon">🚪</span>
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </div>
                        ) : (
                            <LinkContainer to="/login">
                                <Nav.Link className="login-btn">
                                    <span className="login-icon">🔐</span>
                                    Login
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
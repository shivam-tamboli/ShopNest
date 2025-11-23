import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import ProductListPage from './pages/ProductsListPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import CheckoutPage from './pages/CheckoutPage'
import NavBar from './components/Navbar'
import PaymentStatus from './components/PaymentStatus'
import Login from './pages/LoginPage'
import Register from './pages/RegisterPage'
import CardUpdatePage from './pages/CardUpdatePage'
import CardDetailsPage from './pages/CardDetailsPage'
import AccountPage from './pages/AccountPage'
import AccountUpdatePage from './pages/AccountUpdatePage'
import DeleteUserAccountPage from './pages/DeleteUserAccountPage'
import AddressUpdatePage from './pages/AddressUpdatePage'
import OrdersListPage from './pages/OrdersListPage'
import ProductCreatePage from './pages/ProductCreatePage'
import ProductUpdatePage from './pages/ProductUpdatePage'
import NotFound from './pages/NotFoundPage'
import AboutPage from './pages/About';
import ContactUs from './pages/ContactUs';
import ElectronicsPage from './pages/ElectronicsPage';
import ClothingPage from './pages/ClothingPage';
import DecorPage from './pages/DecorPage';
import CartPage from './pages/CartPage'
import CartCheckoutPage from './pages/CartCheckoutPage';
import Wishlist from './components/Wishlist';
import ModernHero from './components/ModernHero'; // ADD THIS IMPORT
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/custom.css';
import './styles/product.css';
import './styles/wishlist.css';
import './styles/ModernHero.css'; // ADD THIS IMPORT

const App = () => {
  return (
    <div>
      <Router>
        <NavBar />
        {/* Remove container mt-4 for full-width hero */}
        <Switch>
          <Route path="/" component={ModernHero} exact /> {/* CHANGE THIS */}
          <Route path="/products" component={ProductListPage} exact /> {/* ADD THIS */}
          <Route path="/new-product/" component={ProductCreatePage} exact />
          <Route path="/product/:id/" component={ProductDetailsPage} exact />
          <Route path="/product-update/:id/" component={ProductUpdatePage} exact />
          <Route path="/payment-status" component={PaymentStatus} exact />
          <Route path="/login" component={Login} exact />
          <Route path="/register" component={Register} exact />
          <Route path="/account" component={AccountPage} exact />
          <Route path="/account/update/" component={AccountUpdatePage} exact />
          <Route path="/account/delete/" component={DeleteUserAccountPage} exact />
          <Route path="/stripe-card-details" component={CardDetailsPage} exact />
          <Route path="/stripe-card-update" component={CardUpdatePage} exact />
          <Route path="/all-addresses/:id/" component={AddressUpdatePage} exact />
          <Route path="/all-orders/" component={OrdersListPage} exact />
          <Route path="/about" component={AboutPage} exact />
          <Route path="/contact" component={ContactUs} exact />
          <Route path="/electronics" component={ElectronicsPage} exact />
          <Route path="/clothing" component={ClothingPage} exact />
          <Route path="/decor" component={DecorPage} exact />
          <Route path="/cart" component={CartPage} exact />
          <Route path="/checkout" component={CheckoutPage} exact />
          <Route path="/cartcheckout" component={CartCheckoutPage} exact />
          <Route path="/checkout/product/:id" component={CheckoutPage} exact />
          <Route path="/wishlist" component={Wishlist} exact />
          <Route path="" component={NotFound} exact />
        </Switch>
      </Router>
    </div >
  )
}

export default App
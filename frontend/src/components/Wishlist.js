import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getWishlist } from '../actions/wishlistActions';
import Product from './Product';
import './../styles/wishlist.css';

const Wishlist = () => {
  const dispatch = useDispatch();

  // Corrected: Use wishlistReducer instead of wishlist
  const wishlistState = useSelector((state) => state.wishlistReducer || {});
  const { loading = false, error = null, wishlistItems = [] } = wishlistState;

  // Corrected: Use userLoginReducer instead of userLogin
  const userLogin = useSelector((state) => state.userLoginReducer || {});
  const { userInfo } = userLogin;

  console.log('User Info in Component:', userInfo); // Debug log

  useEffect(() => {
    if (userInfo) {
      dispatch(getWishlist());
    }
  }, [dispatch, userInfo]);

  if (!userInfo) {
    return (
      <div className="wishlist-container">
        <div className="wishlist-login-prompt">
          <h2>Please log in to view your wishlist</h2>
          <p>Sign in to see your saved items</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <h1>My Wishlist</h1>
        <p className="wishlist-count">
          {wishlistItems.length || 0} {wishlistItems.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      {loading ? (
        <div className="wishlist-loading">
          <div className="loading-spinner"></div>
          <p>Loading your wishlist...</p>
        </div>
      ) : error ? (
        <div className="wishlist-error">
    <h3>Unable to load wishlist</h3>
    <p><strong>Error:</strong> {error}</p>
    <p>This might be because:</p>
    <ul>
      <li>Your session expired - please try logging out and back in</li>
      <li>There's a temporary server issue - please try again later</li>
      <li>Your account doesn't have permission to access the wishlist</li>
    </ul>
    <button 
      onClick={() => window.location.reload()} 
      className="browse-products-btn"
    >
      Retry
    </button>
  </div>
      ) : wishlistItems.length > 0 ? (
        <div className="wishlist-products">
          <div className="products-grid">
            {wishlistItems.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        </div>
      ) : (
        <div className="wishlist-empty">
          <div className="empty-state">
            <div className="empty-heart">🤍</div>
            <h2>Your wishlist is empty</h2>
            <p>Start adding items you love to your wishlist!</p>
            <a href="/" className="browse-products-btn">
              Browse Products
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
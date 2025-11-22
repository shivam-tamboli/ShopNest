import { combineReducers } from "redux";
import {
    productsListReducer,
    productDetailsReducer,
    createProductReducer,
    updateProductReducer,
    deleteProductReducer,
    changeDeliveryStatusReducer,
} from "./productReducers";

import {
    createCardReducer,
    chargeCardReducer,
    savedCardsListReducer,
    deleteSavedCardReducer,
    updateStripeCardtReducer
} from "./cardReducers";

import { cartReducer } from './cartReducers'
import { wishlistReducer } from './wishlistReducers'

import {
    userLoginReducer,
    userRegisterReducer,
    userDetailsReducer,
    userDetailsUpdateReducer,
    deleteUserAccountReducer,
    checkTokenValidationReducer,
    getSingleAddressReducer,
    getAllAddressesOfUserReducer,
    createUserAddressReducer,
    updateUserAddressReducer,
    deleteUserAddressReducer,
    getAllOrdersReducer,
} from "./userReducers";

const reducer = combineReducers({
    productsListReducer,
    productDetailsReducer,
    createProductReducer,
    updateProductReducer,
    deleteProductReducer,
    createCardReducer,
    chargeCardReducer,
    savedCardsListReducer,
    updateStripeCardtReducer,
    deleteSavedCardReducer,
    userLoginReducer,
    userRegisterReducer,
    getSingleAddressReducer,
    getAllAddressesOfUserReducer,
    createUserAddressReducer,
    updateUserAddressReducer,
    deleteUserAddressReducer,
    getAllOrdersReducer,
    changeDeliveryStatusReducer,
    checkTokenValidationReducer,
    userDetailsReducer,
    userDetailsUpdateReducer,
    deleteUserAccountReducer,
    cartReducer,
    wishlistReducer,
})

export default reducer
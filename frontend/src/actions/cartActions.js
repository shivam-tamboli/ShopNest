import {
    CART_REQUEST,
    CART_SUCCESS,
    CART_FAIL,
    CART_ADD_REQUEST,
    CART_ADD_SUCCESS,
    CART_ADD_FAIL,
    CART_REMOVE_REQUEST,
    CART_REMOVE_SUCCESS,
    CART_REMOVE_FAIL,
    CART_UPDATE_REQUEST,
    CART_UPDATE_SUCCESS,
    CART_UPDATE_FAIL,
} from '../constants/index'

import axios from 'axios'

// get cart
export const getCart = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: CART_REQUEST
        })

        const {
            userLoginReducer: { userInfo },
        } = getState()

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.get("/account/cart/", config)

        dispatch({
            type: CART_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: CART_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        })
    }
}

// add to cart
// add to cart - improved version
export const addToCart = (product_id, quantity = 1) => async (dispatch, getState) => {
    try {
        dispatch({
            type: CART_ADD_REQUEST
        })

        const {
            userLoginReducer: { userInfo },
        } = getState()

        // Check if user is logged in
        if (!userInfo || !userInfo.token) {
            const error = "Please login to add items to cart"
            dispatch({
                type: CART_ADD_FAIL,
                payload: error
            })
            throw new Error(error)
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.post("/account/cart/add/", { product_id, quantity }, config)

        dispatch({
            type: CART_ADD_SUCCESS,
            payload: data
        })

        // Dispatch getCart to refresh the cart state
        dispatch(getCart())

        return data

    } catch (error) {
        const errorMessage = error.response && error.response.data.detail 
            ? error.response.data.detail 
            : error.message
        
        console.error("Add to cart error:", errorMessage)
        
        dispatch({
            type: CART_ADD_FAIL,
            payload: errorMessage
        })
        
        throw error
    }
}

// remove from cart
export const removeFromCart = (product_id) => async (dispatch, getState) => {
    try {
        dispatch({ type: CART_REMOVE_REQUEST })

        const {
            userLoginReducer: { userInfo },
        } = getState()

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        }

        const { data } = await axios.post("/account/cart/remove/", { product_id }, config)

        dispatch({ type: CART_REMOVE_SUCCESS, payload: data })
        // Remove this line: dispatch({ type: CART_SUCCESS, payload: data })
    } catch (error) {
        dispatch({
            type: CART_REMOVE_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
        })
    }
}


// update cart item
export const updateCartItem = (product_id, quantity) => async (dispatch, getState) => {
    try {
        dispatch({
            type: CART_UPDATE_REQUEST
        })

        const {
            userLoginReducer: { userInfo },
        } = getState()

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.post("/account/cart/update/", { product_id, quantity }, config)

        dispatch({
            type: CART_UPDATE_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: CART_UPDATE_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        })
    }
}

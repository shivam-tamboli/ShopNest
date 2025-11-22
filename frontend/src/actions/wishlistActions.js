import axios from 'axios'
import {
    WISHLIST_ADD_REQUEST,
    WISHLIST_ADD_SUCCESS,
    WISHLIST_ADD_FAIL,
    WISHLIST_REMOVE_REQUEST,
    WISHLIST_REMOVE_SUCCESS,
    WISHLIST_REMOVE_FAIL,
    WISHLIST_GET_REQUEST,
    WISHLIST_GET_SUCCESS,
    WISHLIST_GET_FAIL,
} from '../constants'

export const toggleWishlist = (productId) => async (dispatch, getState) => {
    try {
        dispatch({
            type: WISHLIST_ADD_REQUEST,
        })

        const {
            userLoginReducer: { userInfo },
        } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        // UPDATED URL (removed /product/):
        const { data } = await axios.post(
            `/api/user/wishlist/toggle/${productId}/`, // Removed /product/
            {},
            config
        )

        dispatch({
            type: WISHLIST_ADD_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: WISHLIST_ADD_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const getWishlist = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: WISHLIST_GET_REQUEST,
        })

        const {
            userLoginReducer: { userInfo },
        } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        // UPDATED URL (removed /product/):
        const { data } = await axios.get(
            `/api/user/wishlist/`, // Removed /product/
            config
        )

        dispatch({
            type: WISHLIST_GET_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: WISHLIST_GET_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}
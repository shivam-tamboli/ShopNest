import {
    WISHLIST_ADD_REQUEST,
    WISHLIST_ADD_SUCCESS,
    WISHLIST_ADD_FAIL,
    WISHLIST_REMOVE_REQUEST,
    WISHLIST_REMOVE_SUCCESS,
    WISHLIST_REMOVE_FAIL,
    WISHLIST_GET_REQUEST,
    WISHLIST_GET_SUCCESS,
    WISHLIST_GET_FAIL
} from '../constants'

export const wishlistReducer = (state = { wishlistItems: [] }, action) => {
    switch (action.type) {
        case WISHLIST_ADD_REQUEST:
        case WISHLIST_REMOVE_REQUEST:
        case WISHLIST_GET_REQUEST:
            return { ...state, loading: true }

        case WISHLIST_GET_SUCCESS:
            return { 
                ...state, 
                loading: false, 
                wishlistItems: action.payload 
            }

        case WISHLIST_ADD_SUCCESS:
            return { 
                ...state, 
                loading: false, 
                wishlistItems: [...state.wishlistItems, action.payload] 
            }

        case WISHLIST_REMOVE_SUCCESS:
            return {
                ...state,
                loading: false,
                wishlistItems: state.wishlistItems.filter(item => item._id !== action.payload)
            }

        case WISHLIST_ADD_FAIL:
        case WISHLIST_REMOVE_FAIL:
        case WISHLIST_GET_FAIL:
            return { ...state, loading: false, error: action.payload }

        default:
            return state
    }
}
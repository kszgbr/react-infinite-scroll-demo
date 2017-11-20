import { combineReducers, createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import promiseMiddleware from 'redux-promise-middleware';
import { getProductList, getProductDetails } from "data.srvc.js"

/** Action types ***************************************************************/

const productActionTypes = {
  FETCH_PRODUCTS: "redux-promise/product/FETCH_PRODUCTS",
  FETCH_PRODUCTS_PENDING: "redux-promise/product/FETCH_PRODUCTS_PENDING",
  FETCH_PRODUCTS_FULFILLED: "redux-promise/product/FETCH_PRODUCTS_FULFILLED",
  FETCH_PRODUCTS_REJECTED: "redux-promise/product/FETCH_PRODUCTS_REJECTED",

  FETCH_PRODUCT_DETAILS: "redux-promise/product/FETCH_PRODUCT_DETAILS",
  FETCH_PRODUCT_DETAILS_PENDING: "redux-promise/product/FETCH_PRODUCT_DETAILS_PENDING",
  FETCH_PRODUCT_DETAILS_FULFILLED: "redux-promise/product/FETCH_PRODUCT_DETAILS_FULFILLED",
  FETCH_PRODUCT_DETAILS_REJECTED: "redux-promise/product/FETCH_PRODUCT_DETAILS_REJECTED"
};

/** Init state *****************************************************************/

const initState = {
  productList: [],
  productListLoading: false,
  productDetailed: {},
  productDetailsLoading: false
};

/** Reducer ********************************************************************/

const productReducer = (state = initState, action) => {
    switch (action.type) {
        case productActionTypes.FETCH_PRODUCTS_PENDING:
            return {...state, productListLoading: true};
            break;
        case productActionTypes.FETCH_PRODUCTS_FULFILLED:
            return {...state, productList: action.payload, productListLoading: false};
            break;
        case productActionTypes.FETCH_PRODUCTS_REJECTED:
            return {...state, productListLoading: false};
            break;
        case productActionTypes.FETCH_PRODUCT_DETAILS_PENDING:
            return {...state, productDetailsLoading: true};
            break;
        case productActionTypes.FETCH_PRODUCT_DETAILS_FULFILLED:
            return {...state, productDetailed: action.payload, productDetailsLoading: false};
            break;
        case productActionTypes.FETCH_PRODUCT_DETAILS_REJECTED:
            return {...state, productDetailsLoading: false};
            break;
        default:
            return state;
  }
}

/** Action creators ************************************************************/

const fetchProductsAC = (thisMany) => {
    return {
        type: productActionTypes.FETCH_PRODUCTS,
        payload: getProductList(thisMany)
    }
}

const fetchProductDetailsAC = (name) => {
    return {
        type: productActionTypes.FETCH_PRODUCT_DETAILS,
        payload: getProductDetails(name)
    }
}

/** Exports ********************************************************************/

const store = createStore(productReducer, composeWithDevTools(applyMiddleware(promiseMiddleware())));

export default store;
export { fetchProductsAC, fetchProductDetailsAC };

// Modules imports
import { configureStore } from '@reduxjs/toolkit';
import favsProductsCountSlice from '../reducers/favPrdSlice';
import favsRecipesCountSlice from '../reducers/favRcpSlice';
import favsCartCountSlice from '../reducers/favCartSlice'
import prdReveiwDisplaySlice from '../reducers/prdReveiwDisplaySlice'
import rcpReveiwDisplaySlice from '../reducers/rcpReveiwDisplaySlice'
import havePrdCommentSlice from '../reducers/havePrdCommentSlice'
import haveRcpCommentSlice from '../reducers/haveRcpCommentSlice'
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';


// Config storage favorites products
const persistProductsConfig = {
  key: 'favPrdCount',
  storage,
};

// Config storage favorites recipes
const persistRecipesConfig = {
  key: 'favRcpCount',
  storage,
};

// Config storage carts
const persistCartsConfig = {
  key: 'favCartCount',
  storage,
};

// Set persisted reducers
const persistedProductsReducer = persistReducer(persistProductsConfig, favsProductsCountSlice);
const persistedRecipesReducer = persistReducer(persistRecipesConfig, favsRecipesCountSlice);
const persistedCartsReducer = persistReducer(persistCartsConfig, favsCartCountSlice);

// Set and export store
export const store = configureStore({
  reducer: {
    favPrdCount: persistedProductsReducer,
    favRcpCount: persistedRecipesReducer,
    favCartCount: persistedCartsReducer,
    prdReveiwDisplay: prdReveiwDisplaySlice,
    rcpReveiwDisplay: rcpReveiwDisplaySlice,
    havePrdComment: havePrdCommentSlice,
    haveRcpComment: haveRcpCommentSlice,
  },
});

// Wrap store in persistor and export
export const persistor = persistStore(store);

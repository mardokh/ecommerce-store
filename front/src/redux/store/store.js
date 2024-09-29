import { configureStore } from '@reduxjs/toolkit'
import favsProductsCountSlice from '../reducers/slice'

export default configureStore({
  reducer: {
    favoritesProductsCount: favsProductsCountSlice,
  },
})
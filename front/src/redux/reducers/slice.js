import { createSlice } from '@reduxjs/toolkit'


export const favsProductsCountSlice = createSlice({
  name: 'favoritesProductsCount',
  initialState: {
    value: 0,
  },
  reducers: {
    addfavsProducts: (state, action) => {
      state.value = action.payload
    },
    delfavsProducts: (state, action) => {
      state.value = action.payload
    },
  },
})


export const { increment, decrement } = counterSlice.actions

export default favsProductsCountSlice.reducer
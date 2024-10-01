import { createSlice } from '@reduxjs/toolkit'


const favsProductsCountSlice = createSlice({
  name: 'favPrdCount',
  initialState: {
    count: 0
  },
  reducers: {
    updateFavsProducts: (state, action) => {
      state.count = action.payload.count
    },
  }
})


export const { updateFavsProducts } = favsProductsCountSlice.actions
export default favsProductsCountSlice.reducer
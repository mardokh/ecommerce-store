import { createSlice } from '@reduxjs/toolkit'


const favsCartCountSlice = createSlice({
  name: 'favCartCount',
  initialState: {
    count: 0
  },
  reducers: {
    updatefavsCarts: (state, action) => {
      state.count = action.payload.count
    },
  }
})


export const { updatefavsCarts } = favsCartCountSlice.actions
export default favsCartCountSlice.reducer
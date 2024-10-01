import { createSlice } from '@reduxjs/toolkit'


const favsRecipesCountSlice = createSlice({
  name: 'favRcpCount',
  initialState: {
    count: 0
  },
  reducers: {
    updateFavsRecipes: (state, action) => {
      state.count = action.payload.count
    },
  }
})


export const { updateFavsRecipes } = favsRecipesCountSlice.actions
export default favsRecipesCountSlice.reducer
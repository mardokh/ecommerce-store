import { createSlice } from '@reduxjs/toolkit'


const prdReveiwDisplaySlice = createSlice({
  name: 'prdReveiwDisplay',
  initialState: {
    status: false
  },
  reducers: {
    updatePrdReveiwDisplay: (state, action) => {
      state.status = action.payload.status
    },
  }
})


export const { updatePrdReveiwDisplay } = prdReveiwDisplaySlice.actions
export default prdReveiwDisplaySlice.reducer
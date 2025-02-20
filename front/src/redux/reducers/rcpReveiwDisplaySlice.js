import { createSlice } from '@reduxjs/toolkit'


const rcpReveiwDisplaySlice = createSlice({
  name: 'rcpReveiwDisplay',
  initialState: {
    status: false
  },
  reducers: {
    updateRcpReveiwDisplay: (state, action) => {
      state.status = action.payload.status
    },
  }
})


export const { updateRcpReveiwDisplay } = rcpReveiwDisplaySlice.actions
export default rcpReveiwDisplaySlice.reducer
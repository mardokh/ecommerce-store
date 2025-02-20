import { createSlice } from '@reduxjs/toolkit'


const haveRcpCommentSlice = createSlice({
  name: 'haveRcpComment',
  initialState: {
    status: false
  },
  reducers: {
    updateHaveRcpComment: (state, action) => {
      state.status = action.payload.status
    },
  }
})


export const { updateHaveRcpComment } = haveRcpCommentSlice.actions
export default haveRcpCommentSlice.reducer
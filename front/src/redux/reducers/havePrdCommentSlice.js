import { createSlice } from '@reduxjs/toolkit'


const havePrdCommentSlice = createSlice({
  name: 'havePrdComment',
  initialState: {
    status: false
  },
  reducers: {
    updateHavePrdComment: (state, action) => {
      state.status = action.payload.status
    },
  }
})


export const { updateHavePrdComment } = havePrdCommentSlice.actions
export default havePrdCommentSlice.reducer
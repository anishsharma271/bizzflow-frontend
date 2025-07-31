import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Dialog } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { handlecloseLoader } from '../../store/auth/authSlice';

const Spinner = () => {
  const token= localStorage.getItem("token")
    const authSelector= useSelector((state)=>state.authSlice)
    const dashboardSelector= useSelector((state)=>state.dashboardSlice)
    const loader= ! token ? authSelector.loading : dashboardSelector.loading
    const dispatch=useDispatch()
  return (
    <Dialog
    open={loader}
    onClose={()=>dispatch(handlecloseLoader(false))}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    PaperProps={{ style: {
        minHeight: '8%',
        maxHeight: '8%',
        minWidth: '8%',
        maxWidth: '8%',
        background:"none",
        boxShadow: 'none',
        overflow: 'hidden'
      }}}

    >
     <Box sx={{ display: 'flex', justifyContent:"center", alignItems:"center" }}>
      <CircularProgress  style={{color:"#dc3545"}}/>
    </Box>
    </Dialog>
   
  )
}

export default Spinner

import React, { useContext } from 'react'
import { Snackbar } from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert'
import { NotifyContext } from '../App'
// import { reducerNotification, initialStatenotification } from '../reducers/notificationReducer'
function Notification() {
  const { notification, dispatchNotification } = useContext(NotifyContext)

  const handleClose = async (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    await dispatchNotification({
      type: 'CLOSE',
      payload: notification.snackbarmsg,
      snacktype: notification.snackbartype,
      snackcolor: notification.snackbarcolor,
    })
  }
  return (
    <div>
        <Snackbar
          elevation={6}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          onClose={handleClose}
          open={notification.snackbaropen}
          autoHideDuration={notification.snackbarduration}
        >
          <MuiAlert
            onClose={handleClose}
            elevation={6}
            variant='filled'
            severity={notification.snackbartype}
            color={notification.snackbarcolor}
            style={{ fontFamily: 'Lemonada' }}
          >
            {notification.snackbarmsg}
          </MuiAlert>
        </Snackbar>
     
    </div>
  )
}

export default Notification

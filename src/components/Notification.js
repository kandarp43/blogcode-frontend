import React, { useContext } from 'react'
import { Snackbar } from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';
import { NotifyContext } from '../App'
// import { reducerNotification, initialStatenotification } from '../reducers/notificationReducer'
function Notification() {
    const { notification, dispatchNotification } = useContext(NotifyContext)

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatchNotification({ type: 'CLOSE', snackcolor: notification.snackbarcolor })
    };
    return (
        <div>
            <Snackbar elevation={6} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={notification.snackbaropen} autoHideDuration={notification.snackbarduration} onClose={handleClose}>
                <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity={notification.snackbartype} color={notification.snackbarcolor} style={{ fontFamily: 'Lemonada' }}>
                    {notification.snackbarmsg}
                </MuiAlert>
            </Snackbar>
        </div >
    )
}

export default Notification
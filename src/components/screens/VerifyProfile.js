import { Button } from '@material-ui/core'
import React, { useContext, useEffect } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import { NotifyContext, UserContext } from '../../App'

function VerifyProfile() {
    document.title = 'Account Verified | BlogCode';
    const { token } = useParams()
    const { id } = useParams()
    const history = useHistory()
    // eslint-disable-next-line
    const { notification, dispatchNotification } = useContext(NotifyContext)
    const { url } = useContext(UserContext)
    useEffect(() => {
        const currentTime = Date.now()
        fetch(url + '/verify', {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token,
                currentTime,
                userId: id
            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    dispatchNotification({ type: 'NOTIFY', payload: data.error, snacktype: 'error' })
                    history.push('/signin')
                }
                else {
                    dispatchNotification({ type: 'NOTIFY', payload: data.message, snacktype: 'success', snackcolor: 'success', duration: 3000 })
                }

            }).catch(err => console.log(err))
    }, [id, dispatchNotification, token, history, url])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <h1 style={{ margin: '50px', color: '#F50057' }} >your account is verified now you can signin with your account</h1>
            <Link to="/signin">
                <Button
                    variant="contained"
                    color="secondary"
                >
                    Sign in
                </Button>
            </Link>
        </div>
    )
}

export default VerifyProfile

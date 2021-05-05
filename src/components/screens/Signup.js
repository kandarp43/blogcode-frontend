import React, { useContext, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { NotifyContext, UserContext } from '../../App'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

export default function SignUp(props) {
  const classes = useStyles()
  // eslint-disable-next-line
  const { url } = useContext(UserContext)
  const history = useHistory()
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [disable, setDisable] = useState(false)
  // eslint-disable-next-line
  const { notification, dispatchNotification, dispatchLoad } = useContext(
    NotifyContext
  )
  document.title = 'Signup | BlogCode'

  useEffect(() => {
    dispatchLoad({ type: 'LOADOFF' })
  }, [dispatchLoad])

  const validateEmail = (value) => {
    setEmail(value)
    setTimeout(() => {
      if (
        // eslint-disable-next-line
        !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,2}))$/.test(
          email
        )
      ) {
        return dispatchNotification({
          type: 'NOTIFY',
          payload: 'please insert correct Email',
          snacktype: 'error',
          snackcolor: 'error',
          duration: 1000,
        })
      } else {
        return dispatchNotification({
          type: 'NOTIFY',
          payload: '',
          snacktype: 'success',
          snackcolor: 'success',
          duration: 1000,
        })
      }
    }, 1000)
  }

  const sendData = (e) => {
    dispatchLoad({ type: 'LOAD' })
    setDisable(true)
    e.preventDefault()
    // eslint-disable-next-line
    fetch(url + '/signup', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        password,
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          dispatchNotification({
            type: 'NOTIFY',
            payload: data.error,
            snacktype: 'error',
            snackcolor: 'error',
          })
          dispatchLoad({ type: 'LOADOFF' })
          setDisable(false)
        } else {
          dispatchNotification({
            type: 'NOTIFY',
            payload: data.message,
            snacktype: 'success',
            snackcolor: 'success',
            duration: 3000,
          })
          setDisable(false)
          dispatchLoad({ type: 'LOADOFF' })
          history.push('/signin')
        }
      })
      .catch((err) => console.log('here'))
  }

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign up
        </Typography>
        <form className={classes.form} onSubmit={(e) => sendData(e)} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name='Username'
                variant='outlined'
                required
                fullWidth
                id='firstName'
                label='Username'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                fullWidth
                // id="email"
                label='Email Address'
                value={email}
                onChange={(e) => validateEmail(e.target.value)}
                autoComplete='email'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                fullWidth
                name='password'
                label='Password'
                type='password'
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
            disabled={disable}
          >
            Sign Up
          </Button>
          <Grid container justify='flex-end'>
            <Grid item>
              <Link to='/signin' variant='body2'>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  )
}

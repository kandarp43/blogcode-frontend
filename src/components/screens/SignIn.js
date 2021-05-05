import React, { useState, useContext, useEffect } from 'react'
import { UserContext } from '../../App'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import { Link, useHistory } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { CardActionArea } from '@material-ui/core'
import { NotifyContext } from '../../App'
import './signin.css'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

export default function SignIn() {
  const classes = useStyles()
  // eslint-disable-next-line
  const { dispatch, url } = useContext(UserContext)
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [disable, setDisable] = useState(false)
  // eslint-disable-next-line
  const { dispatchNotification, dispatchLoad } = useContext(NotifyContext)

  document.title = 'Signin | BlogCode'

  const validateEmail = (value) => {
    setEmail(value)
  }
  useEffect(() => {
    dispatchLoad({ type: 'LOADOFF' })
  }, [dispatchLoad])

  const sendData = (e) => {
    setDisable(true)
    dispatchLoad({ type: 'LOAD' })
    e.preventDefault()
    // eslint-disable-next-line
    fetch(url + '/signin', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          dispatchNotification({
            type: 'NOTIFY',
            payload: data.error,
            snacktype: 'error',
          })
          setDisable(false)
          dispatchLoad({ type: 'LOADOFF' })
        } else {
          localStorage.setItem('jwt', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
          dispatch({ type: 'USER', payload: data.user })
          dispatchNotification({
            type: 'NOTIFY',
            payload: 'Welcome to BlogCode',
            snacktype: 'success',
            snackcolor: 'success',
            duration: 3000,
          })
          setDisable(false)
          dispatchLoad({ type: 'LOADOFF' })
          history.push('/')
        }
      })
      .catch((err) => console.log(err))
  }

  return (
    <div>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign in
          </Typography>
          <form
            className={classes.form}
            onSubmit={(e) => sendData(e)}
            validate='true'
            autoComplete='off'
          >
            <TextField
              color='secondary'
              variant='outlined'
              margin='normal'
              required
              fullWidth
              id='email'
              label='Email Address'
              name='email'
              value={email}
              onChange={(e) => validateEmail(e.target.value)}
              autoComplete='email'
            />
            <TextField
              id='password'
              color='secondary'
              type={'password'}
              margin='normal'
              label='password'
              variant='outlined'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='secondary'
              className={classes.submit}
              disabled={disable}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to='/reset' variant='body2'>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <CardActionArea>
                  <div
                    onClick={() => {
                      history.push('/signup')
                    }}
                    variant='body2'
                  >
                    {"Don't have an account? Sign Up"}
                  </div>
                </CardActionArea>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </div>
  )
}

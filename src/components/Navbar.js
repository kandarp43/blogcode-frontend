import React, { useContext } from 'react'
import './Navbar.css'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { useHistory } from 'react-router-dom'
import { UserContext } from '../App'
import Menubar from './Menubar'
import { Avatar, Button, Slide, useScrollTrigger } from '@material-ui/core'
export default function Navbar() {
  const history = useHistory()
  // eslint-disable-next-line
  const { state, dispatch } = useContext(UserContext)

  function HideOnScroll(props) {
    const { children, window } = props
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({ target: window ? window() : undefined })

    return (
      <Slide appear={false} direction='down' in={!trigger}>
        {children}
      </Slide>
    )
  }

  return (
    <div className='login'>
      <HideOnScroll>
        <AppBar color='inherit' position='static' elevation={1}>
          <Toolbar className='login-navbar'>
            {/* variant="dense"   for make navbar flat */}
            <Typography className='login-logo' variant='h5'>
              <span
                style={{
                  fontFamily: 'Lemonada',
                  fontSize: '30px',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  history.push(state ? '/' : '/')
                }}
              >
                BlogCode
              </span>
            </Typography>
            <div className='nav-buttons'>
              {state ? (
                [
                  <Avatar
                    onClick={() => {
                      history.push('/profile')
                    }}
                    key={'avatar'}
                    variant='rounded'
                    style={{
                      cursor: 'pointer',
                      marginRight: '10px',
                      color: '#fff',
                      backgroundColor: '#b73add',
                    }}
                    className='avatar'
                  >
                    {state.name.slice(0, 1)}
                  </Avatar>,
                  <Menubar key='menubar' />,
                ]
              ) : (
                <div className='navbar-login'>
                  <div className='login-btn'>
                    <Button
                      onClick={() => {
                        history.push('/signin')
                      }}
                      style={{ fontWeight: 'bold', height: '40px', margin: 10 }}
                      variant='contained'
                      color='secondary'
                      key={'signin'}
                    >
                      sign in
                    </Button>
                    <Button
                      onClick={() => {
                        history.push('/signup')
                      }}
                      style={{ fontWeight: 'bold', height: '40px' }}
                      variant='outlined'
                      color='primary'
                      key={'signup'}
                    >
                      Sign Up
                    </Button>
                  </div>
                  <div className='menubar'>
                    <Menubar />
                  </div>
                </div>
              )}
            </div>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
    </div>
  )
}

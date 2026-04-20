import React, { useState } from 'react'
import './Login.css';
import logo from '../../images/logo.png';
import LeftAlignedLabel from '../../components/LeftAlignedLabel';
import API from '../../services/api';
import { Container, CssBaseline, Grid, Paper, Box, Alert } from '@mui/material';
import { FormControl } from '@mui/material';
import { Typography, TextField, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { styled } from '@mui/material/styles';
import * as yup from 'yup';

const Link = styled(RouterLink)(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: 'none',
  fontWeight: 500,
  '&:hover': {
    color: theme.palette.secondary.main,
    textDecoration: 'underline',
  },
}));

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

function Login() {

  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const [alert, setAlert] = useState(null);

  const onSubmit = async (data) => {
    try {
      const response = await API.post('/login', data, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
        validateStatus: () => true
      });
      const token = response.data.token;
      //eslint-disable-next-line
      const expiryTime = Date.now() + 30 * 60 * 1000;
      const { severity, message } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('tokenExpiry', expiryTime.toString());
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('fullname', response.data.fullname);
      console.log('Login successful');
      console.log(localStorage.getItem('username'));
      setAlert({ severity: severity || 'info', message: message || 'Unexpected response' });
      if (severity === 'success') {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
      setAlert({ severity: 'error', message: 'Network error or server unreachable' });
    }
  };

  return (
    <Container component="main" maxWidth={false} disableGutters className='container'>
      <CssBaseline />
      <Grid container sx={{ minHeight: '100vh' }}>
        <Grid className="left-section">
        </Grid>
        <Grid component={Paper} elevation={2}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            width: '55%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img src={logo} alt='Finances Symbol' className='logo'></img>
            <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
              Finance Tracker
            </Typography>
          </Box>
          {alert && (
            <Alert severity={alert.severity} onClose={() => setAlert(false)}
              sx={{
                width: '75%',
                my: 1,
              }}
            >
              {alert.message}
            </Alert>
          )}
          <Box component='form' onSubmit={handleSubmit(onSubmit)} className='login-form'>
            <Typography variant='h6'
              sx={{
                fontWeight: 'bold',
                mb: 2,
              }}
            >
              Login Form
            </Typography>
            <FormControl fullWidth margin='dense'>
              <LeftAlignedLabel required>Username</LeftAlignedLabel>
              <TextField id='username' placeholder='Enter Username'
                {...register('username')}
                error={!!errors.username}
                helperText={errors.username?.message} />
            </FormControl>
            <FormControl fullWidth margin='dense'>
              <LeftAlignedLabel required>Password</LeftAlignedLabel>
              <TextField id="password" type="password" placeholder='Enter password'
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message} />
            </FormControl>
            <Button variant="contained" type="submit" fullWidth
              sx={{
                fontWeight: 'bold',
                mt: 1,
              }}
            >Submit
            </Button>
            <Box sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: '10px',
            }}>
              <Typography variant="subtitle1" sx={{ marginRight: '10px' }}>
                Don't have an account yet ?
              </Typography>
              <Link to="/register">Register</Link>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  )

}

export default Login
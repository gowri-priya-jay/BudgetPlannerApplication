import React, { useState } from 'react';
import logo from '../../images/logo.png'
import LeftAlignedLabel from '../../components/LeftAlignedLabel';
import API from '../../services/api';
import { Container, CssBaseline, Grid, Paper, Box, Alert } from '@mui/material';
import { FormControl } from '@mui/material';
import { Typography, TextField, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { styled } from '@mui/material/styles';
import * as yup from 'yup';

const Link = styled(RouterLink)(({ theme }) => ({
    color: theme.palette.primary.main,
    textDecoration: 'none',
    fontWeight: 500,
    '&:hover': {
        color: theme.palette.primary.dark,
        textDecoration: 'underline',
    },
}));

const schema = yup.object().shape({
    fullname: yup.string().required('Fullname is required'),
    username: yup.string().required('Username is required')
        .min(5, 'Username must be atleast 5 characters'),
    password: yup.string().required('Password is required')
        .min(5, 'Password must be atleast 5 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/\d/, 'Password must contain at least one number')
});

const Register = () => {

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
    });

    const [alert, setAlert] = useState(null);

    const onSubmit = async (data) => {
        console.log(data);
        try {
            const response = await API.post('/register', data, {
                validateStatus: () => true, 
            });

            const { severity, message } = response.data;
            setAlert({severity: severity || 'info', message: message || 'Unexpected response'});
            if (severity === 'success') {
                reset();
            }
        } catch (error) {
            console.error(error);
            setAlert({severity: 'error',message: 'Network error or server unreachable'});
        }
    };

    return (
        <Container component="main" maxWidth={false} disableGutters className='container'>
            <CssBaseline />
            <Grid container>
                <Grid className='left-section'>
                </Grid>
                <Grid component={Paper} elevation={2} square className='right-section'>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <img src={logo} alt='Finances Symbol' className='logo'></img>
                        <Typography variant='h4' sx={{ fontWeight: 'bold'}}>
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
                    <Box component='form' onSubmit={handleSubmit(onSubmit)} className='register-form'>
                        <Typography variant='h6'
                            sx={{
                                fontWeight: 'bold',
                                marginBottom: '10px',
                            }}
                        >
                            Registration Form
                        </Typography>
                        <FormControl fullWidth margin='dense'>
                            <LeftAlignedLabel required>FullName</LeftAlignedLabel>
                            <TextField id='fullname' placeholder='Enter FullName'
                                {...register('fullname')}
                                error={!!errors.fullname}
                                helperText={errors.fullname?.message}
                            />
                        </FormControl>
                        <FormControl fullWidth margin='dense'>
                            <LeftAlignedLabel required>Username</LeftAlignedLabel>
                            <TextField id='username' placeholder='Enter Username'
                                {...register('username')}
                                error={!!errors.username}
                                helperText={errors.username?.message || "Must contain atleast 5 characters"}
                            />
                        </FormControl>
                        <FormControl fullWidth margin='dense'>
                            <LeftAlignedLabel required>Password</LeftAlignedLabel>
                            <TextField id="password" type="password" placeholder='Enter password'
                                {...register('password')}
                                error={!!errors.password}
                                helperText={errors.password?.message || "Must contain atleast 5 characters," +
                                    "One Uppercase and One Number"
                                }
                            />
                        </FormControl>
                        <Button variant="contained" type="submit" fullWidth
                            sx={{
                                fontWeight: 'bold',
                                backgroundColor: 'primary',
                                mt: 1,
                            }}
                        >Register</Button>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: '10px',
                            }}
                        >
                            <Typography variant="subtitle1" sx={{ marginRight: '10px' }}>
                                Already have an account ?
                            </Typography>
                            <Link to="/login">Login</Link>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Register
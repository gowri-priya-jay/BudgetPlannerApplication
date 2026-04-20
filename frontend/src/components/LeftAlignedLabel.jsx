import React from 'react'
import { FormLabel } from '@mui/material';

const LeftAlignedLabel = ({ children, required = false, ...props }) => (
    <FormLabel sx={{ textAlign: 'left' }} {...props}>
        {children}
        {required && <span style={{ color: 'red' }}> *</span>}
    </FormLabel>
);

export default LeftAlignedLabel
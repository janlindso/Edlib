import React from 'react';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import { CssBaseline } from '@mui/material';

const borderColor = '#d1d5da';

const ThemeSetup = ({ children }) => {
    return (
        <StyledComponentsThemeProvider
            theme={{
                colors: {
                    primary: '#1d446b',
                    secondary: '#82df66',
                    tertiary: '#2195f3',
                    success: '#28a745',
                    danger: '#dc3545',
                    gray: '#545454',
                    link: '#4DCFF3',
                    defaultFont: '#545454',
                    background: '#ffffff',
                    border: borderColor,
                    green: '#a7da19',
                    alert: {
                        primary: {
                            background: '#43aeff',
                            font: '#1d3c63',
                        },
                        warning: {
                            background: '#fff3cd',
                            font: '#856404',
                        },
                        danger: {
                            background: '#f8d7da',
                            font: '#721c24',
                        },
                    },
                },
                border: `1px solid ${borderColor}`,
                padding: '5px',
                fontSize: 16,
                typography: {
                    fontFamily: "'Lato', sans-serif",
                    fontWeight: 400,
                },
                breakpoints: {
                    xs: 0,
                    sm: 600,
                    md: 960,
                    lg: 1280,
                    xl: 1920,
                },
                rem: (factor) => `${16 * factor}px`,
            }}
        >
            <CssBaseline />
            {children}
        </StyledComponentsThemeProvider>
    );
};

export default ThemeSetup;

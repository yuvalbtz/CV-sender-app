import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import createEmotionCache from '../utility/createEmotionCache';
import lightTheme from '../styles/theme/lightTheme';
import '../styles/globals.css';
import Layout from '../components/Layout';
import { UserProvider } from '@supabase/auth-helpers-react'

import { supabase } from '../utility/supabaseClient';
import Loader from '../components/loader';





 const clientSideEmotionCache = createEmotionCache();

const MyApp = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps} = props;

 

  return (
   
    
    
      <CacheProvider  value={emotionCache}>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
       <Layout >       
       <Component {...pageProps} />
       </Layout>
      </ThemeProvider>
    </CacheProvider>
    
  

 
  );
};

export default MyApp;

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};


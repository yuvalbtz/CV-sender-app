import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {signIn} from '../utility/createUserWithGoogle'
import {signOut} from '../utility/userSignOut'
import {supabase} from '../utility/supabaseClient'
import { useRouter } from 'next/router';
import { useGoogleLogin, GoogleLogin } from 'react-google-login'


function NavBar() {

// const {signIn, loaded} = useGoogleLogin({
//   clientId:process.env.GOOGLE_CLIENT_ID,
//   onSuccess
// })

const responseGoogle = (response) => {
  console.log(response);
}

const onFailure = (fail) => {
  console.log(fail);
}



const GoogleBtn = () => (
 <div>
  <GoogleLogin
  clientId={process.env.GOOGLE_CLIENT_ID}
  buttonText="Login"
  onSuccess={responseGoogle}
 onFailure={onFailure}
 cookiePolicy={'single_host_origin'}
  />
 </div> 
)


const router = useRouter()
const [user, setUser] = React.useState(null)

React.useEffect(() => {
  const activeSession = supabase.auth.session();
  setUser(activeSession?.user ?? null);
  
 
  
  const { data: authListener} = supabase.auth.onAuthStateChange(
        (event, session) => {
        fetch("/api/auth", {
          method: "POST",
          headers: new Headers({ "Content-Type": "application/json" }),
          credentials: "same-origin",
          body: JSON.stringify({ event, session }),
        })
        .then((res) => {
          if(window.location.pathname === '/UserPage' && event !== 'SIGNED_OUT' ) return
          console.log(event);
          if (event !== 'SIGNED_OUT' && window.location.pathname !== '/UserPage' ) {
            window.location.href = '/UserPage'
          } else {
            window.location.href = '/';
          }
          
          return res.json()
        })
        .catch(err => console.log(err));
        
      }

    );
    console.log('user',user);
    return () => {
      authListener.unsubscribe();
    };
  }, []);

    return (
    <Box sx={{ flexGrow: 1 }}>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          CV sender
        </Typography>
       
        {user ? 
        (<div>
            <Typography variant='p'>
               {user ? user?.user_metadata?.full_name : ''}
            </Typography>
            <Button onClick={() => signOut(supabase)} sx={{textTransform:'none'}} color="inherit">LogOut</Button>
        </div>) : 
        (<><Button onClick={() => signIn(supabase)} sx={{textTransform:'none'}} color="inherit">Sign In</Button></>)}
      </Toolbar>
    </AppBar>
  </Box>
  )
}

export default NavBar





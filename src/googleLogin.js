import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { api_url } from './configuration';

const clientId = "828933434197-6urn9ssh9vo3492i0mtdslsqr5trkld9.apps.googleusercontent.com";
 
const Login = ({ setUserName, setRole}) =>{

    const navigate = useNavigate();

    const loginWithGoogle = async (credentials) => {
        try {
          const response = await axios.post(`${api_url}/authenticate/validate-google-token`, { accessToken: credentials });
          //return response.data;
          
          if(response && response.status==200){
            setUserName(response.data.userName);
            console.log(response.data.userName);
            setRole(response.data.role);
            console.log(response.data.role);
            return response.data.role[0];
          }
        } catch (error) {
          console.error('Error logging in with Google', error);
        }
    };

    const handleCredentialResponse = async(response) => {
        if (response && response.credential) {
            const cd = response.credential;
            console.log("response"+response);
            console.log("credential:"+cd);
            try {
                const loginResponse = await loginWithGoogle(cd);
    
                if (loginResponse === "Admin") {
                    //localStorage.setItem('token', response.credential);
                    console.log('Logged in');
                    navigate('/crud');
                } else if(loginResponse === "User"){
                    navigate('/user');
                }else {
                    console.error('Error logging in');
                }
            } catch (error) {
                console.error('Error logging in with Google', error);
            }
        } else {
            console.error('Error logging in');
        }
    };

    return(
        <GoogleOAuthProvider clientId={clientId}>
        <div id="signInButton">
          <GoogleLogin 
            clientId = {clientId}
            buttonText = "Login"
            onSuccess = {handleCredentialResponse}
            onFailure = {handleCredentialResponse}
            //cookiePolicy = {'single_host_origin'}
            isSignedIn = {false}
            auto_select={false}
            cancel_on_tap_outside = {true}
          />
      </div> 
      </GoogleOAuthProvider>
    )
}

export default Login;
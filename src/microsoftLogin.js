import React from 'react';
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { PublicClientApplication,BrowserAuthError } from '@azure/msal-browser';
import { InteractionType } from '@azure/msal-browser';
import { api_url, local_url } from './configuration';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style.css';

const msalConfig = {
    auth: {
        clientId: "abdd642a-d3bc-4dca-92fd-37af75d69cf3",
        authority: "https://login.microsoftonline.com/3b447d9a-2427-44f4-ad0f-a87ec4c811a2",
        redirectUri: "http://localhost:3000", 
    },
};

const MLogin = ({ setUserName, setRole }) => {
    const navigate = useNavigate();
    const { instance, accounts, inProgress  } = useMsal();
    const loginRequest = {
        scopes: ["User.Read"]
    };

    const handleLogout = () =>{
        instance.logoutPopup({
            postLogoutRedirectUri:"/",
            mainWindowRedirectUri:'/'
        });
    }

    const handleLogin = async () => {
        const response = await instance.loginPopup(loginRequest);
        const username = response.account.username;
        console.log(username);
        try {
            const loginResponse = await loginWithMicrosoft(username);

            if (loginResponse === "Admin") {
                console.log('Logged in');
                navigate('/crud');
            } else if(loginResponse === "User"){
                navigate('/user');
            }else {
                console.error('Error logging in');
            }
        } catch (error) {
            console.error('Error logging in with Microsoft', error);
        }
    };

    const loginWithMicrosoft = async (username) => {
        try {
          const response = await axios.post(`${local_url}/LoginWithMicrosoft?username=${username}`);
          
          if(response && response.status==200){
            setUserName(response.data.userName);
            console.log(response.data.userName);
            setRole(response.data.role.result);
            console.log(response.data.role.result);
            console.log(response.data.role.result[0]);
            return response.data.role.result[0];
          }
        } catch (error) {
          console.error('Error logging in with Microsoft', error);
        }
    };
    
    return (
        <MsalProvider instance={new PublicClientApplication(msalConfig)}>
            <AuthenticatedTemplate>
                <button className='custom-btn custom-btn-primary micro-btn' onClick={() => handleLogin()}>Login with Microsoft</button>
                <button className='custom-btn custom-btn-primary micro-btn' onClick={() => handleLogout()}>Logout</button>
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <button className='custom-btn custom-btn-primary micro-btn' onClick={() => handleLogin()}>Login with Microsoft</button>
                <button className='custom-btn custom-btn-primary micro-btn' onClick={() => handleLogout()}>Logout</button>
            </UnauthenticatedTemplate>
        </MsalProvider>
    );
};

export default MLogin;
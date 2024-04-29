import React, { useState, useEffect} from 'react';
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { api_url } from './configuration';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const msalConfig = {
    auth: {
        clientId: "cbe97ea0-89c4-4a2f-bdf6-90c707728b55",
        authority: "https://login.microsoftonline.com/f8cdef31-a31e-4b4a-93e4-5f571e91255a",
        redirectUri: "http://localhost:3000",
    },
};

const msalInstance = new PublicClientApplication(msalConfig);

const MicroLogin = ({ setUserName, setRole }) => {
    const navigate = useNavigate();

    const loginWithMicrosoft = async (account) => {
        try {
            const tokenResponse = await msalInstance.acquireTokenSilent({
                account: account
            });

            const response = await axios.post(`${api_url}/authenticate/validate-microsoft-token`, { accessToken: tokenResponse.accessToken });
            if (response && response.status === 200) {
                setUserName(response.data.userName);
                setRole(response.data.role);
                navigate(response.data.role === "Admin" ? '/crud' : '/user');
            }
        } catch (error) {
            console.error('Error logging in with Microsoft', error);
        }
    };    

    const handleLogin = async () => {
        try {
            await loginWithMicrosoft();
        } catch (error) {
            console.error('Error logging in with Microsoft', error);
        }
    };

    return (
        <MsalProvider instance={msalInstance}>
            <AuthenticatedTemplate>
                <p>User is authenticated</p>
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <button onClick={handleLogin}>Login with Microsoft</button>
            </UnauthenticatedTemplate>
        </MsalProvider>
    );
};

export default MicroLogin;

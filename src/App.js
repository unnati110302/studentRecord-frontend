import './App.css';
import React, { useState } from 'react';
import CRUD from './CRUD';
import LoginForm from './Login';
import User from './User';
import UserManagement from './UserManagement';
import Header from './Header';
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { PublicClientApplication, EventType,LogLevel } from '@azure/msal-browser';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Teacher from './Teacher';
import Course from './Course';
import CourseEdit from './CourseEdit';
import Section from './Sectiont';
import TeacherSubject from './TeacherSubject';
import TeacherEditSubject from './TeacherEditSubject';

export const msalConfig = {
  auth: {
      clientId: "abdd642a-d3bc-4dca-92fd-37af75d69cf3",
      authority: "https://login.microsoftonline.com/3b447d9a-2427-44f4-ad0f-a87ec4c811a2",
      redirectUri: "http://localhost:3000", 
  },
  cache: {
      cacheLocation: "sessionStorage", 
      storeAuthStateInCookie: false, 
  },
  system: {	
      loggerOptions: {	
          loggerCallback: (level, message, containsPii) => {	
              if (containsPii) {		
                  return;		
              }		
              switch (level) {
                  case LogLevel.Error:
                      console.error(message);
                      return;
                  case LogLevel.Info:
                      console.info(message);
                      return;
                  case LogLevel.Verbose:
                      console.debug(message);
                      return;
                  case LogLevel.Warning:
                      console.warn(message);
                      return;
                  default:
                      return;
              }	
          }	
      }	
  }
};

const msalInstance = new PublicClientApplication(msalConfig);

if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
  msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

msalInstance.addEventCallback((event) => {
  if (
      (event.eventType === EventType.LOGIN_SUCCESS ||
          event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
          event.eventType === EventType.SSO_SILENT_SUCCESS) &&
      event.payload.account
  ) {
      msalInstance.setActiveAccount(event.payload.account);
  }
});

function App() {

  const [userName, setUserName] = useState('');
  const [role, setRole] = useState([]);
  const [id, setId] = useState([]);
  const [classId, setClassId] = useState([]);
  const [tId, setTId] = useState('');

  return (
    <MsalProvider instance={msalInstance}>
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm setUserName={setUserName} setRole={setRole}/>} />
        <Route path="/crud" element={<CRUD userName={userName} role={role}/>} />
        <Route path="/user" element={<User userName={userName} role={role}/>} />
        <Route path="/userManagement" element={<UserManagement userName={userName} role={role}/>} />
        <Route path="/teacher" element={<Teacher userName={userName} role={role} setTId={setTId}/>}/>
        <Route path="/course" element={<Course userName={userName} role={role} setId={setId} />} />
        <Route path="/courseEdit" element={<CourseEdit userName={userName} role={role} id={id} setClassId={setClassId} />} />
        <Route path="/section" element={<Section userName={userName} role={role} classId={classId} />}/>
        <Route path="/teacherSubject" element={<TeacherSubject userName={userName} role={role}/>}/>
        <Route path="/teacherSubject-edit" element={<TeacherEditSubject userName={userName} role={role} tId={tId} />}/>
      </Routes>
    </Router>
    </MsalProvider>
  );
}

export default App;
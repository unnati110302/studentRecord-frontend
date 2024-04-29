import React from 'react'
 
const UtilityFunctions = () => {
    const base64 = (password) =>{
        return (password.replace('+','%2B'));
    }
  return (
    <div>
     
    </div>
  )
}
 
export function replacePlusWithEncoded(str) {   return str.replace(/\+/g, '%2B'); }
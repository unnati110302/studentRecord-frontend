// import React from 'react'
 
// const UtilityFunctions2 = () => {
//     const getToken = async () => {
//         const url = `${local_url}/login`;
//         const data = {
//             "email": "unnati@gmail.com",
//             "password": "Unnati@1",
//         };
     
//         try {
//             const result = await axios.post(url, data);
//             const token = result.data.accessToken;
//             //console.log(token);
//             return token;
//         } catch (error) {
//             console.error('Error fetching token:', error);
//             throw new Error('Failed to fetch token');
//         }
//     };

//     const authorizedFetch = async (url, options = {}) => {
//         try {
//             const token = await getToken();
//             if (!options.headers) {
//                 options.headers = {};
//             }
//             options.headers.Authorization = `Bearer ${token}`;
//             const response = await fetch(url, options);
     
//             if (response.status === 401) {
//                 throw new Error('Unauthorized');
//             }
     
//             return response;
//         } catch (error) {
//             console.error('Error in authorizedFetch:', error);
//             throw error;
//         }
//     };


    
//   return (
//     <div>
     
//     </div>
//   )
// }
 
// export default {authorizedFetch, getToken};
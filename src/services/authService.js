import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`

async function signUp(formData) {
try {
   // Step 1: Send POST request with form data
  const response = await axios.post(`${BASE_URL}/register`, formData);

  // Step 2: Get the data from the response
  const data = response.data;

  // Step 3: Get the token from the response
  const token = data.token || data.access_token;
  if (!token) {
      throw new Error("Registration successful but no token received.");
    }

  // Step 4: Save the token to localStorage
  window.localStorage.setItem('token', token);

  // Step 5: Decode the token to get user data
  const tokenParts = token.split('.');
  const encodedPayload = tokenParts[1];
  const decodedPayload = window.atob(encodedPayload);
  const parsedPayload = JSON.parse(decodedPayload);
  // const user = parsedPayload;
 const user = JSON.parse(window.atob(token.split('.')[1]));  
 // Step 6: Return the user data
  return user;
} catch (error) {
  const message = error.response?.data?.detail || error.response?.data?.message || error.message;
    console.error("SignUp Error:", message);
    throw new Error(message);
}
 

}

async function signIn(formData) {
  try {
    // Step 1: Send POST request with form data
  const response = await axios.post(`${BASE_URL}/login`, formData);

  // Step 2: Get the data from the response
  const data = response.data;

  // Step 3: Get the token from the response
  const token = data.token || data.access_token;
  if (!token) {
      throw new Error("Login successful but no token received.");
    }

  // Step 4: Save the token to localStorage
  window.localStorage.setItem('token', token);

  // Step 5: Decode the token to get user data
  const tokenParts = token.split('.');
  const encodedPayload = tokenParts[1];
  const decodedPayload = window.atob(encodedPayload);
  const parsedPayload = JSON.parse(decodedPayload);
  const user = parsedPayload

  // Step 6: Return the user data
  return user;

  } catch (error) {
    const message = error.response?.data?.detail || error.response?.data?.message || error.message;
    console.error("SignIn Error:", message);
    throw new Error(message)
  }
  
}

export { signUp, signIn };

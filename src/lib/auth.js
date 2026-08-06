import axios from "axios";

export function isAuthed() {
  return !!localStorage.getItem('jwt')
}
export function loginMock(role = 'STUDENT') {
  localStorage.setItem('jwt', 'demo');
  localStorage.setItem('role', role);
  return true;
}
export async function logout() {
  console.log("logout function called");
  const loginDetails = JSON.parse(localStorage.getItem("loginDetails"));
  try {
    await axios.post(
      import.meta.env.VITE_API_BASE_URL + "/login/auth/logout",
      {},
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${loginDetails?.userDetails?.token}`
        }


      }
    );
  } catch (err) {


  }
  finally {
  
    localStorage.removeItem('jwt');
    localStorage.removeItem('role');
    localStorage.removeItem('loginDetails');
  }
  return true;
}
export function role() { return localStorage.getItem('role') || 'STUDENT' }

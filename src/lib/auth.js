export function isAuthed()

{ 
    return !!localStorage.getItem('jwt')
 }
export function loginMock(role='STUDENT'){ 
    localStorage.setItem('jwt','demo'); 
    localStorage.setItem('role',role); 
    return true;
}
export async function logout(){ 
    try {
        await axios.post(
          import.meta.env.VITE_API_BASE_URL + "/login/logout",
          {
            refreshToken: login?.userDetails?.token,
            
          }
        );
      } catch (err) {
        console.log(err, "logout error");
      }
    localStorage.removeItem('jwt'); 
    localStorage.removeItem('role');
    return true; 
}
export function role(){ return localStorage.getItem('role') || 'STUDENT' }

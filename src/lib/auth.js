export function isAuthed()

{ 
    return !!localStorage.getItem('jwt')
 }
export function loginMock(role='STUDENT'){ 
    localStorage.setItem('jwt','demo'); 
    localStorage.setItem('role',role); 
    return true;
}
export function logout(){ 
    localStorage.removeItem('jwt'); 
    localStorage.removeItem('role');
    return true; 
}
export function role(){ return localStorage.getItem('role') || 'STUDENT' }

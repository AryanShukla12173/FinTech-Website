
import Profile from './Profile'
import { useSelector } from 'react-redux'
import Notauthenticated from './Notauthenticated'

function UserProfile() {
    const authStatus= useSelector((state)=>state.auth.status);
    const userdata= useSelector((state)=>state.auth.userData);
    
  if(authStatus){
  return (
    <Profile userData={userdata}/>
  )
} 
else{
   return(<Notauthenticated/>)
}
}

export default UserProfile
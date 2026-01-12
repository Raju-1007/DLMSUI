import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux"
import { useMessage } from "../context/MessageContext";

export default function LoginActivity(){
     const login=useSelector((state)=>state.auth.user)
     const { showSuccess, showError } = useMessage();
    
      const[loginData,setLoginData]=useState("");

     useEffect(()=>{
        if(login?.Adhaar){
        getloginDetails();
      
        }
     },[login.Adhaar])
     
      const getloginDetails = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_BASE_URL+`/api/roles/getRoleByAadhar/${login?.Adhaar}`
      );
      setLoginData(res.data || []);
    } catch(err) {
       showError("Error loading loginData", err);
    }
  };

   

   
     useEffect(() => {
    if (loginData) {
        handleSubmit();
    }
  }, [loginData]);

   const handleSubmit = async () => {
    let payLoad={
       loginId:loginData?.user?.loginid,
        role:loginData?.user?.role,
         adhaar:loginData?.user?.adhaarValue,
          name:loginData?.user?.fullName
,
           email:loginData?.user?.email,
            

   }
    
   console.log(payLoad,"payLoad================================")

    try {
      const res=await axios.post(import.meta.env.VITE_API_BASE_URL+"/api/roles/loginActivty", payLoad);
      

    } catch (e) {
      console.error(e);
    }
  };

  
}
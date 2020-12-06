import jwtDecode from "jwt-decode";
import http from "./httpService"

const apiEndpoint="/signin"
const tokenKey="token"

http.setJwt(getJwt())

async function login(userId,password){
   const data= await http.post(apiEndpoint,{userId,password})
   localStorage.setItem(tokenKey,data["data"])
   return data
}

function loginWithJwt(jwt){
    localStorage.setItem(tokenKey,jwt) 
}

function logout(){
    localStorage.removeItem(tokenKey)
}
 
function getCurrentUser(){
    try {
        const jwt = localStorage.getItem(tokenKey);
        return jwtDecode(jwt);
      } catch (ex) {
          return null
      }
}

function getJwt(){
    return localStorage.getItem(tokenKey)
}

export default{
    login,logout,getCurrentUser,loginWithJwt,getJwt
}
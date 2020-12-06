import http from "./httpService"

const apiEndpoint="/dashboard"

// export function register(user){
//     return http.post(apiEndpoint,{
//         email:user.username,
//         password:user.password,
//         name:user.name
//     })
// }

export function getPreviousScrapedIds(){
    return http.get(apiEndpoint)
}
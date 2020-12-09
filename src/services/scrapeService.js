import http from "./httpService"

const apiEndpoint="/dashboard"

export function askQuestion(id,question){
    return http.post(`${apiEndpoint}/${id}`,{
        question
    })
}

export function getPreviousScrapedIds(){
    return http.get(apiEndpoint)
}

export function sendFileOrLink(data){
    return http.post(apiEndpoint,data)
}
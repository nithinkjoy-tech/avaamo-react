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

export function getScrapedIdData(id){
    return http.get(`${apiEndpoint}/${id}`)
}

export function sendFileOrLink(data,uploadProgress){
    console.log(data,"fg")
    return http.post(apiEndpoint,data,uploadProgress)
}
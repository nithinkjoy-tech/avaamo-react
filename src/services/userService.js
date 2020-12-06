import http from "./httpService";

const apiEndpoint = "/signup";

export function register(user) {
  return http.post(apiEndpoint, {
    name: user.name,
    username: user.username,
    email: user.email,
    password: user.password,
    confirmpassword: user.confirmpassword,
  });
}

export function changePassword(data) {
  return http.post("changepassword", {
    oldpassword: data.oldpassword,
    password: data.password,
    confirmpassword: data.confirmpassword,
  });
}

export function forgotPassword(userId) {
  return http.post("forgot", {
    userId,
  });
}

export function resetPassword(token, data) {
  return http.put(`forgot/${token}`, data);
}

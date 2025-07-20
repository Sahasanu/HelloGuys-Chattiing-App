import { axiosInstance } from '../lib/axios.js'


export const signupfn = async (signupdata) => {
    const response = await axiosInstance.post('/auth/signup', signupdata);
    return response.data
}

export const onboardingfn = async (UserData) => {
    const response = await axiosInstance.post('/auth/onboard', UserData);
    return response.data

}
export const loginfn = async (loginData) => {
    const response = await axiosInstance.post('/auth/login', loginData

    );
    return response.data

}
export const logoutfn = async () => {
    const response = await axiosInstance.get('/auth/logout');
    return response.data;
};
export const getauthuser = async () => {
    const res = await axiosInstance.get('/auth/me')
    return res.data
}
export const getUserfreinds = async () => {
    const res = await axiosInstance.get('/user/friends')
    return res.data
}
export const getRecommendeduser = async () => {
    const res = await axiosInstance.get('/user')
    return res.data
}
export const getOutgoingRequest = async () => {
    const res = await axiosInstance.get('/user/outgoing-friends-request')
    return res.data
}
export const sendfriendrequest = async (userId) => {
    const res = await axiosInstance.get(`/user/friends-request/${userId}`)
    return res.data
}
export const getfriendrequest = async () => {
    const res = await axiosInstance.get('/user/friends-request')
    return res.data
}
export const acceptfriendrequest = async (userId) => {
    const res = await axiosInstance.post(`/user/friends-request/${userId}/accept`)
    return res.data
}
export const getStreamToken = async () => {
    const res = await axiosInstance.get("/chat/token")
    return res.data
}

export const updateProfile = async (profiledata) => {
  const res = await axiosInstance.put("/user/update-profile", profiledata);
  return res.data;
};
export const changePassword = (data) => axiosInstance.put("/auth/change-password", data);


export const deleteAccount = () => axiosInstance.delete("/auth/delete-account");
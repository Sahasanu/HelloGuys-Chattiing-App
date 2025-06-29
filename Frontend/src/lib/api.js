import { axiosInstance } from '../lib/axios.js'


export const signup = async (signupdata) => {
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
export const getauthuser= async () => {
      const res = await axiosInstance.get('/auth/me')
      return res.data
    }
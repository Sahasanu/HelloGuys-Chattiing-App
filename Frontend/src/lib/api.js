import { axiosInstance } from '../lib/axios.js'


export const signup = async (signupdata) => {
    const response = await axiosInstance.post('/auth/signup', signupdata);
    return response.data
}
export const getauthuser= async () => {
      const res = await axiosInstance.get('/auth/me')
      return res.data
    }
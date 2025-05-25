import { getauthuser } from "../lib/api"
import { useQuery } from '@tanstack/react-query'

 const  useAuthUser = () => {
 const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getauthuser,
    retry: false,
  })
    return  {isLoading: authUser.isLoading,authUser:authUser.authData?.user} 
}

export default useAuthUser

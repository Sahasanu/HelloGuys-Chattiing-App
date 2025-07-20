import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { loginfn } from '../lib/api';
import { toast } from 'react-hot-toast';

function useLogin() {
 const queryClient = useQueryClient()
  const navigate = useNavigate()

 
  const { mutate:login, isPending } = useMutation({
    mutationFn: loginfn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      toast.success("logged in successfully!")
      navigate('/', { replace: true });
    },
    onError: (error) => {
      toast.error((error?.response?.data?.message || "Login failed"), {style:{background:"#000000", color: "white"}})
    }
})
return {login,isPending}

  
}

export default useLogin

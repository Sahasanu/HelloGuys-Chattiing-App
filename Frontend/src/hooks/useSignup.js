import { signupfn } from '../lib/api.js'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function useSignup() {
  
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate:signup, isPending } = useMutation({
    mutationFn:signupfn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      toast.success("Account created successfully!")
      navigate('/', { replace: true });
    },
    onError: (error) => {
      toast.error((error?.response?.data?.message || "Signup failed"), {style:{background:"#000000", color: "white"}})
    }
  })
  return { signup, isPending }
  
  
  
   
}

export default useSignup

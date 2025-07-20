import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logoutfn } from '../lib/api'; 
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const useLogout = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { mutate: logout, isPending } = useMutation({
        mutationFn: logoutfn,
        onSuccess: () => {
             queryClient.setQueryData(['authUser'], null);

             navigate('/login', { replace: true }); // redirect to login
            toast.success('Logged out successfully!');
            
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || 'Logout failed', {
                style: { background: '#000000', color: 'white' },
            });
        },
    });

    return { logout, isPending };
};

export default useLogout;
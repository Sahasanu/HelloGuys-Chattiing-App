import { getauthuser } from "../lib/api";
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from "react";

const useAuthUser = () => {
  const [authUser, setAuthUser] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: getauthuser,
    retry: false,
  });

  useEffect(() => {
    if (data?.user) {
      setAuthUser(data.user);
    }
  }, [data]);

  return { authUser, setAuthUser, isLoading };
};

export default useAuthUser;

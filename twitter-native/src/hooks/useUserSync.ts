import { useApiClient, userApi } from "@/utils/api";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

export const useUserSync = () => {
    const { user, isLoaded } = useUser();
    const { isSignedIn } = useAuth();
    const api = useApiClient();

    const syncUserMutation = useMutation({
        mutationFn: (userData: any) => userApi.syncUser(api, userData),
        onSuccess: (response: any) => console.log("User synced successfully", response.data.user),
        onError: (error: any) => console.error("User sync failed:", error.response?.data || error.message)
    })

    useEffect(() => {
        if (isSignedIn && isLoaded && user && !syncUserMutation.data && !syncUserMutation.isPending) {
            syncUserMutation.mutate({
                email: user.primaryEmailAddress?.emailAddress,
                name: user.fullName,
                image: user.imageUrl,
            });
        }
    }, [isSignedIn, isLoaded, user])
    return null
}
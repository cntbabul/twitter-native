import EditProfileModal from "@/components/EditProfileModal";
import PostsList from "@/components/PostsList";
import SignOutButton from "@/components/SignOutButton";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePosts } from "@/hooks/usePosts";
import { useProfile } from "@/hooks/useProfile";
import { Feather } from "@expo/vector-icons";
import { format } from "date-fns";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Image, TouchableOpacity, RefreshControl } from 'react-native';

const ProfileScreens = () => {

    const { currentUser, isLoading } = useCurrentUser();
    const insets = useSafeAreaInsets();

    const { posts: userPosts, refetch: refetchPosts, isLoading: isRefetching, } = usePosts(currentUser?.username);
    const { isEditModalVisible, openEditModal, closeEditModal, formData, saveProfile, updateFormField, isUpdating, refetch: refetchProfile, } = useProfile();

    if (isLoading) {
        return (
            <View className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#1DA1F2" />
            </View>
        )
    }

    if (!currentUser) {
        return (
            <View className="flex-1 bg-white items-center justify-center">
                <Text>User not found</Text>
            </View>
        )
    }

    return (
        <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 py-3 border-b border-gray-100">
                <View>
                    <Text className="text-xl font-bold text-gray-900">
                        {currentUser.firstName} {currentUser.lastName}
                    </Text>
                    <Text className="text-gray-500 text-sm">{userPosts.length} Posts</Text>
                </View>
                <SignOutButton />
            </View>
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={() => {
                            refetchProfile();
                            refetchPosts();
                        }}
                        tintColor="#1DA1F2"
                    />
                }
            >
                {/* Cover Image */}
                <Image
                    source={{ uri: currentUser?.bannerImage || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop" }}
                    className="w-full h-48"
                    resizeMode="cover"
                />
                <View className="px-4 pb-4 border-b border-gray-100">
                    {/* profile image+ edit button  */}
                    <View className="flex-row justify-between items-end -mt-16 mb-4">
                        <Image
                            source={{ uri: currentUser?.profileImage }}
                            className="w-32 h-32 rounded-full border-4 border-white"
                        />
                        <TouchableOpacity className="border border-gray-300 px-6 py-2 rounded-full"
                            onPress={openEditModal}
                        >
                            <Text className="font-semibold text-gray-900">Edit Profile</Text>

                        </TouchableOpacity>
                    </View>

                </View>


            </ScrollView>
        </SafeAreaView>
    )
}

export default ProfileScreens;
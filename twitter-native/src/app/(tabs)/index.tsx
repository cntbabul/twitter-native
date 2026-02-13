import { usePosts } from "@/hooks/usePosts";
import { useUserSync } from "@/hooks/useUserSync";
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [isFetching, setIsRefetching] = useState(false);
  const { refetch: refetchPosts } = usePosts();

  const handlePullRefresh = async () => {
    setIsRefetching(true);

    await refetchPosts();
    setIsRefetching(false)
  }
  useUserSync();

  return (
    <SafeAreaView>

      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-xl font-bold text-blue-500">
          Welcome to expo app!
        </Text>
      </View>
    </SafeAreaView>
  );
}

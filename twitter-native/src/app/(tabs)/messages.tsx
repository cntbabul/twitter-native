import { CONVERSATIONS, ConversationType } from "@/data/conversations";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
    View,
    Text,
    Alert,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Image,
    Modal,
    FlatList,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function messagesScreen() {
    const insets = useSafeAreaInsets();

    const [searchText, setSearchText] = useState("");
    const [conversationsList, setConversationsList] = useState(CONVERSATIONS);
    const [selectedConversation, setSelectedConversation] = useState<ConversationType | null>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [newMessage, setNewMessage] = useState("");

    const filteredConversations = conversationsList.filter(
        (conv) =>
            conv.user.name.toLowerCase().includes(searchText.toLowerCase()) ||
            conv.user.username.toLowerCase().includes(searchText.toLowerCase())
    );

    const deleteConversation = (conversationId: number) => {
        Alert.alert(
            "Delete Conversation",
            "Are you sure you want to delete this conversation?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        setConversationsList((prev) => prev.filter((conv) => conv.id !== conversationId));
                    },
                },
            ]
        );
    };

    const openConversation = (conversation: ConversationType) => {
        setSelectedConversation(conversation);
        setIsChatOpen(true);
    };

    const sendMessage = () => {
        if (newMessage.trim() && selectedConversation) {
            setConversationsList((prev) => prev.map((conv) =>
                conv.id === selectedConversation.id ?
                    {
                        ...conv, lastMessage: newMessage, time: "now"
                    }
                    : conv
            ));

            // Add message to current conversation in memory (optional, seeing as we update the list)
            if (selectedConversation) {
                // In a real app we'd add to the messages array too, but this is a mock
            }

            setNewMessage("");
            Alert.alert("Message sent!",
                `Your message has been sent to ${selectedConversation.user.name}`,
            );
            setIsChatOpen(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
                <Text className="text-xl font-bold text-black">Messages</Text>
                <TouchableOpacity>
                    <Feather name="settings" size={20} color="black" />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View className="px-4 py-2">
                <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
                    <Feather name="search" size={20} color="#657786" />
                    <TextInput
                        placeholder="Search for people and groups"
                        placeholderTextColor="#657786"
                        className="flex-1 ml-2 text-base text-black"
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>
            </View>

            {/* Conversation List */}
            <FlatList
                data={filteredConversations}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        className="flex-row items-center px-4 py-3 border-b border-gray-50 bg-white"
                        onPress={() => openConversation(item)}
                        onLongPress={() => deleteConversation(item.id)}
                    >
                        <Image
                            source={{ uri: item.user.avatar }}
                            className="w-12 h-12 rounded-full mr-3"
                        />
                        <View className="flex-1">
                            <View className="flex-row items-center justify-between mb-1">
                                <View className="flex-row items-center">
                                    <Text className="font-bold text-base text-black mr-1">
                                        {item.user.name}
                                    </Text>
                                    <Text className="text-gray-500 text-sm">@{item.user.username}</Text>
                                </View>
                                <Text className="text-gray-500 text-xs">{item.time}</Text>
                            </View>
                            <Text className="text-gray-600 text-sm" numberOfLines={1}>
                                {item.lastMessage}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
                contentContainerStyle={{ paddingBottom: 80 }}
            />

            {/* Floating Action Button */}
            <TouchableOpacity
                className="absolute bottom-6 right-4 bg-[#1DA1F2] w-14 h-14 rounded-full items-center justify-center shadow-lg"
                onPress={() => Alert.alert("New Message", "This would open a contact selector")}
            >
                <Feather name="mail" size={24} color="white" />
            </TouchableOpacity>

            {/* Chat Modal */}
            <Modal
                visible={isChatOpen}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setIsChatOpen(false)}
            >
                <SafeAreaView className="flex-1 bg-white">
                    <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
                        <TouchableOpacity onPress={() => setIsChatOpen(false)} className="mr-4">
                            <Feather name="arrow-left" size={24} color="black" />
                        </TouchableOpacity>
                        {selectedConversation && (
                            <View className="flex-1">
                                <Text className="font-bold text-lg">{selectedConversation.user.name}</Text>
                                <Text className="text-gray-500 text-sm">@{selectedConversation.user.username}</Text>
                            </View>
                        )}
                    </View>

                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        className="flex-1"
                    >
                        <ScrollView className="flex-1 p-4">
                            {/* In a real app, map through selectedConversation.messages here */}
                            {selectedConversation?.messages.map((msg) => (
                                <View
                                    key={msg.id}
                                    className={`mb-4 max-w-[80%] p-3 rounded-2xl ${msg.fromUser
                                        ? "bg-[#1DA1F2] self-end rounded-br-none"
                                        : "bg-gray-100 self-start rounded-bl-none"
                                        }`}
                                >
                                    <Text className={msg.fromUser ? "text-white" : "text-black"}>
                                        {msg.text}
                                    </Text>
                                    <Text className={`text-xs mt-1 ${msg.fromUser ? "text-blue-100" : "text-gray-500"}`}>
                                        {msg.time}
                                    </Text>
                                </View>
                            ))}
                        </ScrollView>

                        <View className="p-4 border-t border-gray-100 flex-row items-center">
                            <TextInput
                                className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2"
                                placeholder="Start a message"
                                value={newMessage}
                                onChangeText={setNewMessage}
                            />
                            <TouchableOpacity onPress={sendMessage}>
                                <Feather name="send" size={24} color="#1DA1F2" />
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}

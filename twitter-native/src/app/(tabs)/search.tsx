import { Feather } from '@expo/vector-icons'
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const TRENDING_TOPICS = [
    { topic: "#ReactNative", tweets: "125K" },
    { topic: "#TypeScript", tweets: "120K" },
    { topic: "#JavaScript", tweets: "110K" },
    { topic: "#NextJs", tweets: "105K" },
    { topic: "#NodeJs", tweets: "100K" },
    { topic: "#ReactNative", tweets: "125K" },
    { topic: "#TypeScript", tweets: "120K" },
    { topic: "#JavaScript", tweets: "110K" },
    { topic: "#NextJs", tweets: "105K" },
    { topic: "#NodeJs", tweets: "100K" },
]

const searchScreen = () => {

    return (
        <SafeAreaView className='flex-1 bg-white' >
            {/* search bar */}
            <View className='px-4 py-3 border-b border-gray-400'>
                <View className='flex-row items-center bg-gray-100 rounded-full px-5 py-2'>
                    <Feather name='search' size={20} color='#657786' />
                    <TextInput
                        placeholder='Search on Twitter'
                        className='flex-1 ml-3 text-base'
                        placeholderTextColor="#657786"
                    />
                </View>
            </View>
            {/* trending topics  */}
            <ScrollView className='flex-1'>
                <View className='p-4'>
                    <Text className='text-xl font-bold text-gray-900 mb-4'>
                        Trending for you
                    </Text>
                    {TRENDING_TOPICS.map((topic, index) => (
                        <TouchableOpacity key={index} className='py-4 pl-4 border-b border-gray-100'>
                            <Text className='text-sm text-gray-500'>
                                Trending in Technology
                            </Text>
                            <Text className="font-bold text-gray-900 text-lg">{topic.topic}</Text>
                            <Text className="text-gray-500 text-sm">{topic.tweets} Tweets</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default searchScreen
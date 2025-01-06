// Import necessary libraries  
import React, { useContext, useEffect, useState } from 'react';  
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';    
import axios from 'axios';  
import { AuthContext } from '../AuthContext/AuthContext';  
import { router } from 'expo-router';

// Define the type for your message  
interface Message {  
    sender: string;  
    lastMessage: string;  
    timestamp: string;  
    avatar: string; // Assuming you have avatar URLs  
    unreadCount: number; 
    fullName: string;
}  

const Chat = () => {  
    const [messages, setMessages] = useState<Message[]>([]);  
    const [isLoading, setIsLoading] = useState(true); // Loader state
    const { authUser, baseURL } = useContext(AuthContext);     

    const fetchMessages = async () => {
        try {
            setIsLoading(true); // Show loader
            const response = await axios.get(`${baseURL}/api/chats/${authUser.userId}`);
            console.log(response.data.data);
            
            const structuredMessages = response.data.data.map((chat) => ({
                sender: chat.partnerId,
                lastMessage: chat.lastMessage.text,
                timestamp: chat.timestamp,
                avatar: chat.partner.avatar,
                fullName: chat.partner.fullName,
                type: chat.lastMessage.type,
                unreadCount: chat.unreadCount || 0, // Default to 0 if unreadCount is not provided
            }));

            console.log("messages: ", structuredMessages);
            setMessages(structuredMessages);
        } catch (error) {
            console.error('Error fetching messages: ', error);
        } finally {
            setIsLoading(false); // Hide loader
        }
    };
  
    useEffect(() => {
        fetchMessages();
    }, []);   

    const renderMessageItem = ({ item }: { item: Message }) => (  
        <TouchableOpacity
            onPress={() => router.push({ pathname: "/ChatScreen", params: { name: item.fullName, receiver: item.sender } })}
        >
            <View style={styles.messageContainer}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <View style={styles.messageContent}>
                    <Text style={styles.sender}>{item.fullName}</Text>
                    <Text style={styles.message}>{item.lastMessage}</Text>
                </View>
                <View style={styles.timeContainer}>
                    <Text style={styles.time}>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    {item.unreadCount > 0 && (
                        <View style={styles.unreadCount}>
                            <Text style={styles.unreadCountText}>{item.unreadCount}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity> 
    );  

    return (  
        <View style={styles.container}>  
            <Text style={styles.title}>Chats</Text>  
            {isLoading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#4CAF50" />
                </View>
            ) : messages.length > 0 ? (
                <FlatList  
                    data={messages}  
                    renderItem={renderMessageItem}  
                    keyExtractor={(item, index) => index.toString()}  
                />
            ) : (
                <View style={styles.noChatsContainer}>
                    <Text style={styles.noChatsText}>No Chats</Text>
                </View>
            )}
        </View>  
    );  
};  

const styles = StyleSheet.create({  
    container: {  
        flex: 1,  
        padding: 16,  
        backgroundColor: '#fff', 
        marginTop: 40, 
    },  
    title: {  
        fontSize: 24,  
        marginBottom: 16,  
    },  
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },  
    messageContainer: {  
        flexDirection: 'row',  
        alignItems: 'center',  
        marginVertical: 8,  
        borderBottomWidth: 1,  
        borderBottomColor: '#ccc',  
        paddingBottom: 8,  
    },  
    avatar: {  
        width: 40,  
        height: 40,  
        borderRadius: 20,  
        marginRight: 10,  
    },  
    messageContent: {  
        flex: 1,  
    },  
    sender: {  
        fontWeight: 'bold',  
        fontSize: 16,  
    },  
    message: {  
        marginLeft: 10,  
        color: '#555',  
    },  
    timeContainer: {  
        alignItems: 'flex-end',  
        marginLeft: 10,  
    },  
    time: {  
        fontSize: 12,  
        color: '#999',  
    },  
    unreadCount: {  
        backgroundColor: '#4CAF50',  
        borderRadius: 10,  
        paddingHorizontal: 6,  
        paddingVertical: 2,  
        marginTop: 2,  
    },  
    unreadCountText: {  
        color: '#fff',  
        fontSize: 12,  
    },  
    noChatsContainer: {  
        flex: 1,  
        justifyContent: 'center',  
        alignItems: 'center',  
    },  
    noChatsText: {  
        fontSize: 18,  
        color: '#555',  
    },  
});   

export default Chat;

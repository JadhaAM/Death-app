import { Ionicons } from '@expo/vector-icons';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import axios from 'axios';
import  { AuthContext } from './AuthContext/AuthContext';
import { debounce } from 'lodash';

interface Message {
    text: string;
    type: string;
    sender: string;
    receiver: string;
    timestamp: string;
    status: string;
}

interface Chat {
    receiver: string;
    sender: { _id: string; avatar: string; fullName: string };
    content: { text: string; type: string };
    timestamp: string;
}

const ChatScreen = () => {
    const navigation = useNavigation();
    const { receiver, name } = useLocalSearchParams();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const { authUser, baseURL} = useContext(AuthContext);
    const sender = authUser.userId;
    const socketUrl = process.env.EXPO_PUBLIC_SOCKET_URL; // Replace with your actual IP address  
    const [socket, setSocket] = useState<WebSocket | null>(null);
 
   


    const fetchMessages = useCallback(async () => {
        try {
            const response = await axios.get(`${baseURL}/api/chats/${sender}/${receiver}`);
            const structuredMessages = response.data.data.messages.map((chat: Chat) => ({
                receiver: chat.receiver,
                sender: chat.sender._id,
                text: chat.content.text,
                timestamp: chat.timestamp,
                avatar: chat.sender.avatar,
                fullName: chat.sender.fullName,
                type: chat.content.type,
            }));
            setMessages(structuredMessages || []);
        } catch (error) {

        }
    }, [sender, receiver, baseURL]);

    useEffect(() => {
        const ws = new WebSocket(socketUrl);
        setSocket(ws);

        ws.onopen = () => {
            console.log('WebSocket connected');
            // Register the sender and receiver in the WebSocket server  
            // ws.send(JSON.stringify({ type: 'registerUser', userId: sender }));
            // ws.send(JSON.stringify({ type: 'registerUser', userId: receiver }));
        };
        // ws.onerror = (error) => console.error('WebSocket error:', error);
        ws.onclose = () => {
            console.log('WebSocket disconnected');
            setSocket(null); // Reset socket state  
        };

        const handleMessage = (event: MessageEvent) => {
            const receivedMessage = JSON.parse(event.data);
            if (receivedMessage.type === "receiveMessage") {
                const messageContent = receivedMessage.content;
                if (messageContent && typeof messageContent === 'string') {
                    const newMessage: Message = {
                        sender: receivedMessage.senderId,
                        receiver: '',
                        text: messageContent,
                        timestamp: '',
                        type: 'text',
                        status: 'read',
                    };

                    // Only update the message list if the message is from the receiver
                    if (receivedMessage.senderId === receiver) {
                        setMessages((prevMessages) => [...prevMessages, newMessage]);
                    }
                }
            }


            if (receivedMessage.type === "typing" && receivedMessage.senderId === receiver) {
                setIsTyping(true);
                setTimeout(() => setIsTyping(false), 3000); // Reset typing after 3 seconds  
            }
        };

        ws.addEventListener("message", handleMessage);

        // Fetch previous messages when component mounts  
        fetchMessages();

        return () => {
            // Cleanup function to close the WebSocket connection and remove the event listener  
            ws.removeEventListener("message", handleMessage);
            ws.close();
        };
    }, [fetchMessages, receiver, sender]);

    const handleSendMessage = async () => {
        setIsTyping(false);
        if (!input.trim()) return;

        const content: String = input;

        try {
            const newMessage = {
                senderId: sender,
                receiverId: receiver,
                content: content,

            };
            const storingMessage :Message= {
                sender: sender,
                receiver: receiver,
                text: content,
                timestamp: new Date().toISOString(), // Add a timestamp
                type: 'text', // Assuming type is always 'text'
                status: 'sent',
            };

            if (socket) {
                // Send the message through the WebSocket connection  
                socket.send(JSON.stringify({ type: 'sendMessage', ...newMessage }));
                setMessages((prevMessages) => [...prevMessages, storingMessage]);
            }

            setInput(''); // Clear input field  
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const debouncedTyping = debounce((text: string) => {
        setInput(text);
        if (text.trim()) {
            setIsTyping(true);
            if (socket) {
                socket.send(JSON.stringify({ type: 'typing', senderId: sender, receiverId: receiver }));
            }
        } else {
            setIsTyping(false);
        }
    }, 300);

    const renderMessageItem = ({ item }: { item: Message }) => (
    <View
        style={[
            styles.messageContainer,
            item.sender === sender ? styles.messageYou : styles.messageOther,
        ]}
    >
        <Text
            style={item.sender === sender ? styles.messageTextYou : styles.messageTextOther}
        >
            {item.text}
        </Text>
        <View style={styles.messageInfoContainer}>
            <Text style={styles.messageTime}>
                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            {item.sender === sender && <Text style={styles.messageStatus}>{item.status}</Text>}
        </View>
    </View>
);


    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Ionicons
                    onPress={() => navigation.goBack()}
                    name="chevron-back"
                    size={24}
                    color="black"
                />
                <Text style={styles.header}>{name}</Text>
                <View style={styles.headerIcons}>
                    <Ionicons name="search" size={24} color="black" />
                </View>
                <View style={styles.headerIcons}>
                    <Ionicons name="ellipsis-vertical" size={24} color="black" />
                </View>
            </View>

            <FlatList
                data={messages}
                renderItem={renderMessageItem}
                keyExtractor={(item) => item.timestamp}
                contentContainerStyle={{ paddingBottom: 80 }}

            />

           

            <View style={styles.inputContainer}>
                <TouchableOpacity>
                    <Ionicons name="add" size={24} color="black" />
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    value={input}
                    onChangeText={debouncedTyping}
                />
                <TouchableOpacity onPress={handleSendMessage}>
                    <Ionicons name="send" size={24} color="rgba(0, 45, 227, 1)" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 40,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        marginLeft: 16,
    },
    headerIcons: {
        flexDirection: 'row',
    },
    messageContainer: {
        maxWidth: '75%',
        marginVertical: 6,
        padding: 12,
        borderRadius: 12,
    },
    messageYou: {
        alignSelf: 'flex-end',
        backgroundColor: 'rgba(0, 45, 227, 1)',
    },
    messageOther: {
        alignSelf: 'flex-start',
        backgroundColor: '#f0f0f0',
    },
    messageTextYou: {
        color: '#fff',
        fontSize: 14,
    },
    messageTextOther: {
        color: '#000',
        fontSize: 14,
    },
    messageInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    messageTime: {
        fontSize: 10,
        color: '#aaa',
    },
    messageStatus: {
        fontSize: 10,
        color: '#aaa',
        marginLeft: 8,
    },
    typingIndicator: {
        fontStyle: 'italic',
        color: '#aaa',
        padding: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        padding: 10,
        marginHorizontal: 10,
    },
});

export default ChatScreen;
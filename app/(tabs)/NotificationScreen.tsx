import React, { useContext, useEffect, useState } from 'react';  
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';    
import axios from 'axios';  
import { AuthContext } from '../AuthContext/AuthContext';  
import { router, useLocalSearchParams } from 'expo-router'; 
import Header from '@/components/Header';

interface Message {  
    id:string;
    sender: string; 
    text:string;  
    type:string;
    timestamp: string; 
    receiver:string;
    status:string;
    fullName:string;
    profileImage:string;

}  

const Notification = () => {  
    const [messages, setMessages] = useState<Message[]>([]);  
    const [loading, setLoading] = useState<boolean>(true); // Loader state
    const { authUser, baseURL } = useContext(AuthContext); 
    

    const fetchMessages = async () => {
        try { 
           
            const response = await axios.get(`${baseURL}/api/notification/${authUser.userId}`);
            const data = response.data.notifications.map((list) => ({
                id:list._id,
                sender: list.sender._id,
                fullName:list.sender.fullName,
                profileImage:list.sender.profileImage,
                status:list.status,
                text: list.content,
                type: '',
                timestamp: list.timestamp,
            }));
            setMessages(data);
        } catch (error) {
            
        } finally {
            setLoading(false); // Stop loader after fetch
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
                    <Image source={{ uri: item.profileImage}} style={styles.avatar} />
                    <View style={styles.messageContent}>
                        <Text style={styles.sender}>{item.fullName}</Text>
                        <Text style={styles.message}>{item.text}</Text>
                    </View>
                    <View style={styles.timeContainer}>
                        <Text style={styles.time}>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                       
                    </View>
                </View>
            </TouchableOpacity> 
        );   

    return (  
        <View style={styles.container}>   
            <Header title="Notifications" />
            {loading ? ( // Show loader while fetching data
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#4CAF50" />
                </View>
            ) : messages.length === 0 ? ( // Show "No Contact" if no messages
                <View style={styles.noContactContainer}>
                    <Text style={styles.noContactText}>No Notifications Found</Text>
                </View>
            ) : (
                <FlatList  
                    data={messages}  
                    renderItem={renderMessageItem}  
                    keyExtractor={(item, index) => index.toString()}  
                />
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
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noContactContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noContactText: {
        fontSize: 18,
        color: '#999',
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
    message: {  
        marginLeft: 10,  
        color: '#555',  
    },  
    sender: {  
        fontWeight: 'bold',  
        fontSize: 16,  
    },  
    timeContainer: {  
        alignItems: 'flex-end',  
        marginLeft: 10,  
    },  
    time: {  
        fontSize: 12,  
        color: '#999',  
    },  
});   

export default Notification;

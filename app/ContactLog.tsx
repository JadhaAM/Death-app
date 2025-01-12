import React, { useContext, useEffect, useState } from 'react';  
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';    
import axios from 'axios';  
import { AuthContext } from './AuthContext/AuthContext';  
import { useLocalSearchParams } from 'expo-router'; 
import Header from '@/components/Header';

interface Message {  
    sender: string;   
    timestamp: string;  
    businessImage: string;  
    businessName: string;
    category: string;
    address: string;
    rating: string;
    description: string;
}  

const ContactLog = () => {  
    const [messages, setMessages] = useState<Message[]>([]);  
    const [loading, setLoading] = useState<boolean>(true); // Loader state
    const { authUser, baseURL } = useContext(AuthContext); 
    const { businessId } = useLocalSearchParams();      

    const fetchMessages = async () => {
        try { 
            const userId=authUser.userId;
            const response = await axios.get(`${baseURL}/api/businesses/contact-status/${userId}/${businessId}`);
            const data = response.data.allContacts.map((list) => ({
                _id: list.contactId,
                category: list.category,
                businessName: list.businessName,
                businessImage: list.businessImage,
                address: list.address,
                rating: list.rating,
                description: list.description,
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
        <TouchableOpacity>
            <View style={styles.messageContainer}>
                <Image source={{ uri: item.businessImage }} style={styles.avatar} />
                <View style={styles.messageContent}>
                    <Text style={styles.sender}>{item.businessName}</Text>
                </View>
                <View style={styles.timeContainer}>
                    <Text style={styles.time}>
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
            </View>
        </TouchableOpacity> 
    );  

    return (  
        <View style={styles.container}>   
            <Header title="Contacted Businesses" />
            {loading ? ( // Show loader while fetching data
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#4CAF50" />
                </View>
            ) : messages.length === 0 ? ( // Show "No Contact" if no messages
                <View style={styles.noContactContainer}>
                    <Text style={styles.noContactText}>No Contact Found</Text>
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

export default ContactLog;

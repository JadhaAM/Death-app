// Import necessary libraries  
import React, { useContext, useEffect, useState } from 'react';  
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';    
import axios from 'axios';  
import { AuthContext } from './AuthContext/AuthContext';  
import { router } from 'expo-router';
import Header from '@/components/Header';



// Define the type for your message  
interface Message {  
    sender: string;  
    lastMessage: string;  
    timestamp: string;  
    avatar: string; // Assuming you have avatar URLs  
    unreadCount: number; 
    fullName:String;

}  

const ContactLog= () => {  
    const [messages, setMessages] = useState<Message[]>([]);  // Specify Message type for state  
    const { authUser, baseURL} = useContext(AuthContext);     
    const fetchMessages = async () => {
        try {
          const response = await axios.get(`${baseURL}/api/chats/${authUser}`);
        
            console.log(response.data.data);
            
          const structuredMessages = response.data.data.map((chat) => ({
             
            sender: chat.partnerId,
            lastMessage: chat.lastMessage.text,
            timestamp: chat.timestamp,
            avatar:chat.partner.avatar,
            fullName:chat.partner.fullName,
            type: chat.lastMessage.type,
          }));
           
          console.log( "messages :",structuredMessages);
          setMessages(structuredMessages);
          
        } catch (error) {
          console.error('Error fetching messages: ',  error);
        }
      };
  
    
      useEffect(() => {
        fetchMessages();
        
      }, []);   

      
  
    const renderMessageItem = ({ item }: { item:Message }) => (  
          
        <TouchableOpacity
      onPress={() =>  router.push({pathname: "/ChatScreen",params: { name:item.fullName ,receiver:item.sender,}, })}
    >
      <View style={styles.messageContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.messageContent}>
          <Text style={styles.sender}>{item.fullName}</Text>
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
            <Header title="Contact Bussenness">
            </Header>
           
            <FlatList  
                data={messages}  
                renderItem={renderMessageItem}  
                keyExtractor={(item, index) => index.toString()}  
            />  
        </View>  
    );  
};  

const styles = StyleSheet.create({  
    container: {  
        flex: 1,  
        padding: 16,  
        backgroundColor: '#fff',  
    },  
    title: {  
        fontSize: 24,  
        marginBottom: 16,  
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
});   

export default ContactLog;
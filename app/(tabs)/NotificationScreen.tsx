import Header from '@/components/Header';
import React from 'react';  
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';  
import { date } from 'yup';

const notifications = [  
    { id: '1', user: 'Athalia Putri', message: 'Has sent you a text.', time: '15m ago', image: 'https://via.placeholder.com/40/0000FF/FFFFFF?text=A' },  
    { id: '2', user: 'Midala Huera', message: '😮😮', time: '15m ago', image: 'https://via.placeholder.com/40/FF0000/FFFFFF?text=M' },  
    { id: '3', user: 'Midala Huera', message: 'Replied to your text', time: '15m ago', image: 'https://via.placeholder.com/40/00FF00/FFFFFF?text=M' },  
    { id: '4', user: 'Midala Huera', message: '😞😞', time: '15m ago', image: 'https://via.placeholder.com/40/FFFF00/FFFFFF?text=M' }  
];  

const NotificationScreen = () => {  
    const renderItem = ({ item }) => (  
        <View style={styles.notificationItem}>  
            <Image source={{ uri: item.image }} style={styles.avatar} />  
            <View style={styles.notificationContent}>  
                <Text style={styles.userName}>{item.user}</Text>  
                <Text style={styles.message}>{item.message}</Text>  
            </View>  
            <Text style={styles.time}>{item.time}</Text>  
        </View>  
    );  

    return (  
        <View style={styles.container}>  
            <Text style={styles.header}></Text>  
            <View>
                <Header title="Notification" />

            </View>
            <FlatList  
                data={notifications}  
                renderItem={renderItem}  
                keyExtractor={item => item.id}  
                showsVerticalScrollIndicator={false}  
            />  
        </View>  
    );  
}  

const styles = StyleSheet.create({  
    container: {  
        flex: 1,  
        padding: 16,  
        backgroundColor: '#fff',  
    },  
    header: {  
        fontSize: 24,  
        fontWeight: 'bold',  
        marginBottom: 16,  
    },  
    notificationItem: {  
        flexDirection: 'row',  
        alignItems: 'center',  
        paddingVertical: 10,  
        borderBottomWidth: 1,  
        borderBottomColor: '#E0E0E0',  
    },  
    avatar: {  
        width: 40,  
        height: 40,  
        borderRadius: 20,  
        marginRight: 10,  
    },  
    notificationContent: {  
        flex: 1,  
    },  
    userName: {  
        fontWeight: 'bold',  
    },  
    message: {  
        color: '#757575',  
    },  
    time: {  
        fontSize: 12,  
        color: '#B0BEC5',  
    },  
});  

export default NotificationScreen;  


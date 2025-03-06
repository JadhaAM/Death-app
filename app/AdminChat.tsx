import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { AuthContext } from "./AuthContext/AuthContext";
import { router } from "expo-router";
import Header from "@/components/Header";

interface Message {
  id: string;
  sender: string;
  text: string;
  type: string;
  timestamp: string;
  receiver: string;
  status: string; // "read" or "unread"
  fullName: string;
  profileImage: string;
}

const AdminChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0); // State for unread messages
  const [loading, setLoading] = useState<boolean>(true); // Loader state
  const { authUser, baseURL } = useContext(AuthContext);

  // Fetch messages and calculate unread count
  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/api/notification/${authUser.userId}`,
      );

      // Use `reduce` to get the latest message per sender and calculate unread count
      const data = response.data.notifications.reduce(
        (acc, list) => {
          const senderId = list.sender._id;
          const existingMessage = acc.messages.find(
            (msg) => msg.sender === senderId,
          );

          if (
            !existingMessage ||
            new Date(list.timestamp) > new Date(existingMessage.timestamp)
          ) {
            const messageData = {
              id: list._id,
              sender: senderId,
              fullName: list.sender.fullName,
              profileImage: list.sender.profileImage,
              status: list.status, // Assuming backend provides "read" or "unread"
              text: list.content,
              type: "",
              timestamp: list.timestamp,
            };

            // Replace or add the message for this sender
            acc.messages = [
              ...acc.messages.filter((msg) => msg.sender !== senderId),
              messageData,
            ];
          }

          // Increment unread count if the message is unread
          if (list.status === "unread") {
            acc.unreadCount++;
          }

          return acc;
        },
        { messages: [], unreadCount: 0 },
      );

      setMessages(data.messages); // Update messages state
      setUnreadCount(data.unreadCount); // Update unread count state
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false); // Stop loader after fetch
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);
  const formattedTimestamp = (timestamp: String) => {
    const date = new Date(timestamp);
    const today = new Date();

    // Check if the date is today
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    if (isToday) {
      // Show time format
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      // Show date format
      return date.toLocaleDateString();
    }
  };
  const renderMessageItem = ({ item }: { item: Message }) => (
    <TouchableOpacity
      onPress={() => {
        setUnreadCount(0);
        router.push({
          pathname: "/ChatScreen",
          params: { name: item.fullName, receiver: item.sender },
        });

        // Mark the message as read dynamically
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === item.id ? { ...msg, status: "read" } : msg,
          ),
        );
        setUnreadCount(
          (prevCount) => prevCount - (item.status === "unread" ? 1 : 0),
        );
      }}
    >
      <View style={styles.messageContainer}>
        <Image source={{ uri: item.profileImage }} style={styles.avatar} />
        <View style={styles.messageContent}>
          <Text style={styles.sender}>{item.fullName}</Text>
          <Text
            style={[
              styles.message,
              item.status === "unread" && styles.unreadMessage,
            ]}
          >
            {item.text}
          </Text>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{formattedTimestamp(item.timestamp)}</Text>
          {/* {item.status === "unread" && (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
                        </View>
                    )} */}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title={`Notifications`} />

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
    backgroundColor: "#fff",
    marginTop: 40,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noContactContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noContactText: {
    fontSize: 18,
    color: "#999",
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    padding: 12, // Increased padding for better spacing
    borderRadius: 10, // Rounded corners for messages
    backgroundColor: "#f8f8f8", // Light background color for each message
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 20,
    marginRight: 10,
  },
  messageContent: {
    flex: 1,
  },
  message: {
    marginLeft: 10,
    color: "#555",
  },
  unreadMessage: {
    fontWeight: 400,
    color: "#000",
  },
  sender: {
    fontWeight: "bold",
    fontSize: 16,
  },
  timeContainer: {
    alignItems: "flex-end",
    marginLeft: 10,
  },
  time: {
    fontSize: 12,
    color: "#999",
  },
  unreadBadge: {
    backgroundColor: "#FF6347", // Red for unread
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginTop: 2,
  },
  unreadBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  unreadCountContainer: {
    marginBottom: 10,
    alignItems: "flex-start",
  },
  unreadCountText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF6347", // Red for unread count
  },
});

export default AdminChat;

import React, { useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  
} from 'react-native';
import { router, useRouter } from 'expo-router'; 
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './AuthContext/AuthContext';



const SplashScreen = () => {
  const router = useRouter();
  const {setAuthUser ,setToken}=useContext(AuthContext);
  
  return (
    <View style={styles.container}>
      {/* Icon */}
      <View style={styles.iconContainer}>
        <Image
          source={require('../assets/images/file.png')} 
          style={styles.image} 
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>The Legacy App</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Now Death Planning is in one place and always under control
      </Text>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() => router.push('/(auth)/SignInOption')} 
        >
          <Text style={styles.buttonTextPrimary}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => router.push('/(auth)/SignUp')} 
        >
          <Text style={styles.buttonTextSecondary}>Create account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {

    marginBottom: 40,
  },
  image: {
    width: 315.61,
    height: 100,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#7A7A7A',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
  },
  buttonPrimary: {
    backgroundColor: '#3366FF',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
    width: width * 0.8,
    alignSelf: 'center',
  },
  buttonTextPrimary: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonSecondary: {
    borderColor: '#E6E6E6',
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 8,
    width: width * 0.8,
    alignSelf: 'center',
  },
  buttonTextSecondary: {
    color: '#000000',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SplashScreen;

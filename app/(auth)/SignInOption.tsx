import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import  AuthContext  from '../AuthContext/AuthContext';
import { Try } from 'expo-router/build/views/Try';


const LoginScreen = () => {
  const {ContinueWithGoogle}= useContext(AuthContext);
  const router = useRouter();

 

  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/Legacy App 1.png')}
          style={styles.logo}
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>THE LEGACY APP</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Now Death Planning is in one place{'\n'}and always under control
      </Text>

      {/* Social Login Buttons */}
      <View style={styles.buttonContainer}>
        {/* Google */}
        <TouchableOpacity style={styles.socialButton} onPress={()=>ContinueWithGoogle()}>
          <FontAwesome name="google" size={20} color="#DB4437" />
          <Text style={styles.socialButtonText} >Continue with Google</Text>
        </TouchableOpacity>

        {/* Apple */}
        <TouchableOpacity style={styles.socialButton} >
          <FontAwesome name="apple" size={20} color="#000000" />
          <Text style={styles.socialButtonText}>Continue with Apple</Text>
        </TouchableOpacity>

        {/* Phone */}
        <TouchableOpacity style={styles.socialButton} >
          <FontAwesome name="phone" size={20} color="#000000" />
          <Text style={styles.socialButtonText} onPress={()=>router.push("/(auth)/loginWithPhone")}>Continue with Phone</Text>
        </TouchableOpacity>
      </View>

      {/* Log In */}
      <Text style={styles.footerText}>
        Already have an account?{' '}
        <Text style={styles.loginText} onPress={() => router.push('/(auth)/SignIn')}>
          Log in
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7A7A7A',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 30,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 30,
    paddingVertical: 12,
    marginBottom: 12,
  },
  socialButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  footerText: {
    fontSize: 14,
    color: '#7A7A7A',
  },
  loginText: {
    color: '#3366FF',
    fontWeight: 'bold',
  },
});

export default LoginScreen;

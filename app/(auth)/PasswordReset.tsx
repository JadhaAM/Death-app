import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image,GestureResponderEvent, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { router } from 'expo-router';
import { AuthContext } from '../AuthContext/AuthContext';

const PasswordResetScreen = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
   const { authUser , baseURL} = useContext(AuthContext);
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters long')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm your password'),
  });
  
  const handleSubmit = async (values: { password: string ,confirmPassword:string }) => {
    console.log(authUser);
    try {
      setIsLoading(true);
       await axios.post(`${baseURL}/api/user/reset-password`, {
        password: values.password,
        confirmPassword: values.confirmPassword,
        userID:authUser,
      });
      Alert.alert('Success', 'Your password has been changed successfully!');
      router.push("/(auth)/SignIn");
    } catch (error) {
      Alert.alert("Error", "Failed to sign out");
    } finally {
      setIsLoading(false);
    }
   
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/Star 8.png')}
                style={styles.logo}
              />
            </View>
      <Formik
        initialValues={{ password: '', confirmPassword: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <Text style={styles.title}>Reset password</Text>
            <Text style={styles.subtitle}>Please type something you’ll remember</Text>

            <TextInput
              style={styles.input}
              placeholder="New password"
              secureTextEntry
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />
            {touched.password && errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
              secureTextEntry
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              value={values.confirmPassword}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <Text style={styles.error}>{errors.confirmPassword}</Text>
            )}

            <TouchableOpacity style={styles.button} onPress={handleSubmit as unknown as (event: GestureResponderEvent) => void} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (<Text style={styles.buttonText}>Reset password</Text>)}
            </TouchableOpacity>
          </>
        )}
      </Formik>

      <Text style={styles.footer}>
        Already have an account? <Text style={styles.loginText} onPress={() => router.push("/(auth)/SignIn")}>Log In</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 220,
    height: 250,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2962FF',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  footer: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
  },
  loginText: {
    fontWeight: 'bold',
    color: '#4F8EF7',
  },
});

export default PasswordResetScreen;
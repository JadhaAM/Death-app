import React, { useState, useEffect, useContext, useRef } from 'react';  
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';  
import AuthContext from '../AuthContext/AuthContext';  
import { useRouter } from 'expo-router';  

const PasswordRecovery = () => {  
  const router = useRouter();  
  const { Emailverification } = useContext(AuthContext);  
  const [step, setStep] = useState(1); // 1: Input email, 2: Input verification code  
  const [email, setEmail] = useState('');  
  const [code, setCode] = useState(['', '', '', '', '', '']); // Array to hold each digit of the code  
  const [timer, setTimer] = useState(0); // Timer for verification code  
  const inputRefs = useRef<(TextInput | null)[]>([]); // Specify the type for the ref  

  const handleEmailCheckAndSendCode = async () => {  
    try {  
      console.log(email);  
      Alert.alert(email);  

      const response = await Emailverification(email);  
      console.log(response);  

      setTimer(20); // Start the countdown timer  
      setStep(2); // Proceed to verification step  
    } catch (error) {  
      Alert.alert('Error', 'Something went wrong. Please try again.', error.message);  
    }  
  };  

  useEffect(() => {  
    let countdown: NodeJS.Timeout | undefined;  
    if (timer > 0) {  
      countdown = setInterval(() => {  
        setTimer(prev => prev - 1);  
      }, 1000);  
    }  
    return () => clearInterval(countdown);  
  }, [timer]);  

  const handleVerifyCode = () => {  
    const fullCode = code.join(''); // Join the array to create the full code  
    console.log('Verification code entered:', fullCode);  
    Alert.alert('Success', 'Code verified successfully!');  
    router.push("/(auth)PasswordResetScreen");
  };  

  const handleCodeChange = (value: string, index: number) => {  
    // Update the specific index in the code array  
    const newCode = [...code];  
    newCode[index] = value;  

    // Update the state  
    setCode(newCode);  

    // Move to the next input if the value is not empty  
    if (value && index < code.length - 1) {  
      inputRefs.current[index + 1]?.focus(); // Use optional chaining  
    }  
  };  

  const handleKeyPress = (index: number) => {  
    // Move to the previous input if the backspace is pressed and the current input is empty  
    if (index > 0 && !code[index]) {  
      inputRefs.current[index - 1]?.focus(); // Use optional chaining  
    }  
  };  

  return (  
    <View style={styles.container}>  
      {step === 1 ? (  
        <>  
          <Text style={styles.title}>Forgot password?</Text>  
          <Text style={styles.subtitle}>  
            Don't worry! It happens. Please enter the email associated with your account.  
          </Text>  
          <TextInput  
            style={styles.input}  
            placeholder="Enter your email address"  
            value={email}  
            onChangeText={setEmail}  
            keyboardType="email-address"  
            placeholderTextColor="#999"  
          />  
          <TouchableOpacity style={styles.button} onPress={handleEmailCheckAndSendCode}>  
            <Text style={styles.buttonText}>Send code</Text>  
          </TouchableOpacity>  

          {/* Footer */}  
          <Text style={styles.footer} onPress={() => Alert.alert('Password Remembered!')}>  
            Remember password?{" "}  
            <Text style={styles.loginText} onPress={() => router.push("/(auth)/SignIn")}>  
              Log In  
            </Text>  
          </Text>  
        </>  
      ) : (  
        <>  
          <Text style={styles.title}>Please check your email</Text>  
          <Text style={styles.subtitle}>  
            We've sent a code to <Text style={styles.boldText}>{email}</Text>  
          </Text>  
          <View style={styles.codeInputContainer}>  
            {code.map((digit, index) => (  
              <TextInput  
                key={index}  
                style={styles.codeInput}  
                placeholder=""  
                maxLength={1}  
                keyboardType="numeric"  
                value={digit}  
                onChangeText={(value) => handleCodeChange(value, index)}  
                onKeyPress={() => handleKeyPress(index)}  
                ref={(ref) => (inputRefs.current[index] = ref)} // Assign ref to the input  
              />  
            ))}  
          </View>  
          <TouchableOpacity style={styles.button} onPress={handleVerifyCode}>  
            <Text style={styles.buttonText}>Verify</Text>  
          </TouchableOpacity>  
          <Text style={styles.timer}>  
            {timer > 0 ? `Send code again in ${timer}s` : 'Code expired. Please request a new one.'}  
          </Text>  
        </>  
      )}  
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
  title: {  
    fontSize: 28,  
    fontWeight: '700',  
    color: '#000',  
    marginBottom: 10,  
  },  
  subtitle: {  
    fontSize: 16,  
    color: '#555',  
    marginBottom: 30,  
    lineHeight: 22,  
  },  
  boldText: {  
    fontWeight: '600',  
  },  
  input: {  
    borderColor: '#ddd',  
    borderWidth: 1,  
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
  codeInputContainer: {  
    flexDirection: 'row',  
    justifyContent: 'space-between',  
    marginBottom: 20,  
  },  
  codeInput: {  
    borderWidth: 1,  
    borderColor: '#ddd',  
    borderRadius: 8,  
    textAlign: 'center',  
    padding: 10,  
    fontSize: 15,  
    width: '15%',  
    color: '#000',  
  },  
  timer: {  
    textAlign: 'center',  
    color: '#FF3D00',  
    fontSize: 14,  
    marginTop: 10,  
  },  
  footer: { marginTop: 55, textAlign: "center", fontSize: 14, color: "#333" },  
  loginText: { fontWeight: "bold", color: "#4F8EF7" },  
});  

export default PasswordRecovery;
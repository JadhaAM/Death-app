import React, { useState, useEffect, useContext, useRef } from "react";  
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";  
import CountryPicker from 'react-native-country-picker-modal';  
import AuthContext from "../AuthContext/AuthContext";  

const LoginWithPhone = () => {  
  const { sendOTP, verifyOTP } = useContext(AuthContext);  
  const [step, setStep] = useState(1);  
  const [phoneNumber, setPhoneNumber] = useState("");  
  const [otp, setOtp] = useState(Array(6).fill("")); // Array to hold OTP digits  
  const otpRefs = useRef<(TextInput | null)[]>(Array(6).fill(null));  
  const [wrongOtp, setWrongOtp] = useState(false);  
  const [resendTimer, setResendTimer] = useState(20);  
  const [countryCode, setCountryCode] = useState<'FR' | 'US' | 'IN'>('FR'); // Example with specific values  
  const [callingCode, setCallingCode] = useState('+33');   

  useEffect(() => {  
    let timer: NodeJS.Timeout | undefined;  
    if (step === 2 && resendTimer > 0) {  
      timer = setInterval(() => setResendTimer(prev => prev - 1), 1000);  
    }  
    return () => clearInterval(timer);  
  }, [step, resendTimer]);  
  
  // Handle Sending OTP  
  const handleSendOTP = async (phoneNumber: string) => {  
    if (!phoneNumber || phoneNumber.length < 1) {  
      alert("Please enter your phone number.");  
      return;  
    }  
  
    const formattedPhoneNumber = `${callingCode} ${phoneNumber.replace(/\s+/g, '')}`;  
    console.log("Formatted Phone Number:", formattedPhoneNumber);  
  
    if (formattedPhoneNumber.length > 16) {  
      alert("Phone number must be a maximum of 15 digits including the country code.");  
      return;  
    }  
  
    try {  
     const respons= await sendOTP(formattedPhoneNumber);  
      setOtp(Array(6).fill("")); // Reset OTP input  
      setStep(2); // Move to OTP input step  
      setResendTimer(20); // Reset resend timer  
      alert("OTP sent! Please check your messages."); 
      console.log(respons);
       
    } catch (error) {  
      alert("Error sending OTP. Please try again.");   
    }  
    
  };  

  const handleOTPSubmit =  async() => {  
    const otpCode = otp.join(""); // Join the OTP array into a single string  
    console.log(otpCode);
    
   const respons= await verifyOTP(); 
      console.log(respons);
      
        alert("Phone Verified Successfully!");  
        
     
  };  

  const handleResendCode = () => {  
    setResendTimer(20);  
    setWrongOtp(false);  
    setOtp(Array(6).fill(""));  
    sendOTP(phoneNumber);  
  };  

  const handleOtpChange = (index: number, value: string) => {  
    const newOtp = [...otp];  
    newOtp[index] = value.slice(0, 1); // Only accept one character  
    setOtp(newOtp);  

    // Move focus to the next input if current is filled  
    if (newOtp[index] && index < otp.length - 1) {  
        otpRefs.current[index + 1]?.focus(); // Use the ref to focus on the next input  
    }  
}; 

  return (  
    <ScrollView contentContainerStyle={styles.container}>  
      {step === 1 ? (  
        <View>  
          <Text style={styles.header}>Log in</Text>  
          <Text style={styles.subtext}>  
            Please confirm your country code and enter your phone number.  
          </Text>  
          <CountryPicker  
            containerButtonStyle={styles.phoneContainer}  
            countryCode={countryCode}  
            withFlag  
            withCountryNameButton  
            withCallingCode  
            onSelect={(country) => {  
              setCountryCode(country.cca2);  
              setCallingCode(`+${country.callingCode[0]}`);  
            }}  
          />  
          <View style={styles.phoneContainer}>  
            <TextInput  
              style={styles.countryCode}  
              value={callingCode}  
              editable={false}  
            />  
            <TextInput  
              style={styles.phoneInput}  
              placeholder="Phone Number"  
              keyboardType="phone-pad"  
              value={phoneNumber}  
              onChangeText={setPhoneNumber}  
            />  
          </View>  
          <TouchableOpacity style={styles.button} onPress={() => handleSendOTP(phoneNumber)} disabled={!phoneNumber}>  
            <Text style={styles.buttonText}>Continue</Text>  
          </TouchableOpacity>  
        </View>  
      ) : (  
        <View>  
          <Text style={styles.header}>Enter code</Text>  
          <Text style={styles.subtext}>We've sent an SMS with an activation code to your phone {callingCode} {phoneNumber}</Text>  
          <View style={styles.otpContainer}>  
            {otp.map((digit, index) => (  
              <TextInput  
                key={index} 
                ref={(ref) => (otpRefs.current[index] = ref)} 
                style={styles.otpInput}  
                value={digit}  
                keyboardType="number-pad"  
                maxLength={1}  
                onChangeText={(value) => handleOtpChange(index, value)}  
                onFocus={() => setWrongOtp(false)} // Reset wrong OTP state on focus  
              />  
            ))}           </View>  
            {wrongOtp && <Text style={styles.errorText}>Wrong code, please try again</Text>}  
            <Text>  
              {resendTimer > 0 ? (  
                `Send code again in ${resendTimer} seconds`  
              ) : (  
                <TouchableOpacity onPress={handleResendCode}>  
                  <Text style={styles.resendText}>Resend Code</Text>  
                </TouchableOpacity>  
              )}  
            </Text>  
            <TouchableOpacity style={styles.button} onPress={handleOTPSubmit}>  
              <Text style={styles.buttonText}>Verify</Text>  
            </TouchableOpacity>  
          </View>  
        )}  
      </ScrollView>  
    );  
  };  
  
  const styles = StyleSheet.create({  
    container: {  
      flexGrow: 1,  
      padding: 20,  
      backgroundColor: "#fff",  
    },  
    header: {  
      fontSize: 28,  
      fontWeight: "bold",  
      marginBottom: 10,  
    },  
    subtext: {  
      fontSize: 14,  
      color: "#555",  
      marginBottom: 20,  
    },  
    phoneContainer: {  
      flexDirection: "row",  
      alignItems: "center",  
      marginBottom: 20,  
    },  
    countryCode: {  
      width: 60,  
      height: 50,  
      borderWidth: 1,  
      borderColor: "#ccc",  
      borderRadius: 8,  
      textAlign: "center",  
      marginRight: 10,  
    },  
    phoneInput: {  
      flex: 1,  
      height: 50,  
      borderWidth: 1,  
      borderColor: "#ccc",  
      borderRadius: 8,  
      paddingLeft: 10,  
    },  
    otpContainer: {  
      flexDirection: "row",  
      justifyContent: "space-between",  
      marginBottom: 20,  
    },  
    otpInput: {  
      width: 40,  
      height: 50,  
      borderWidth: 1,  
      borderColor: "#ccc",  
      borderRadius: 8,  
      textAlign: "center",  
      fontSize: 20,  
      marginHorizontal: 5,  
    },  
    button: {  
      backgroundColor: "#4F8EF7",  
      borderRadius: 8,  
      paddingVertical: 12,  
      alignItems: "center",  
      marginTop: 10,  
    },  
    buttonText: {  
      color: "#fff",  
      fontWeight: "bold",  
      fontSize: 16,  
    },  
    errorText: {  
      color: "red",  
      textAlign: "center",  
      marginBottom: 10,  
    },  
    resendText: {  
      color: "#4F8EF7",  
      textAlign: "center",  
    },  
  });  
  
  export default LoginWithPhone;
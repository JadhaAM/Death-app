import React, { useState, useEffect, useRef, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';
import CountryFlag from 'react-native-country-flag';
import axios from "axios";
import { AuthContext } from "../AuthContext/AuthContext";
import { router } from "expo-router";


const LoginWithPhone = () => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const otpRefs = useRef<(TextInput | null)[]>(Array(6).fill(null));
  const [wrongOtp, setWrongOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(20);
  const [selectedCountry, setSelectedCountry] = useState("FR");
  const [callingCode, setCallingCode] = useState("+33");
  const { baseURL ,setPhoneVerified}=useContext(AuthContext);
  const [isLoading, setIsLoading] = useState<boolean>(false); 

  const countryList = [
    { code: "FR", name: "France", callingCode: "+33" },
    { code: "US", name: "United States", callingCode: "+1" },
    { code: "IN", name: "India", callingCode: "+91" },
    { code: "GB", name: "United Kingdom", callingCode: "+44" },
    { code: "DE", name: "Germany", callingCode: "+49" },
    { code: "CA", name: "Canada", callingCode: "+1" },
    { code: "AU", name: "Australia", callingCode: "+61" },
    { code: "JP", name: "Japan", callingCode: "+81" },
    { code: "CN", name: "China", callingCode: "+86" },
    { code: "BR", name: "Brazil", callingCode: "+55" },
  ];

  const handleCountryChange = (countryCode: string) => {
    const country = countryList.find((c) => c.code === countryCode);
    if (country) {
      setSelectedCountry(countryCode);
      setCallingCode(country.callingCode);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (step === 2 && resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);
  
  const handleSendOTP = async (phoneNumber: string)=> {
     const formattedPhoneNumber = `${callingCode}${phoneNumber.replace(/\s+/g, "")}`;
     
  
    setIsLoading(true);
    try {
      const response = await axios.post(`${baseURL}/api/user/send-code`,{
        phoneNumber:formattedPhoneNumber,
      })
      setOtp(Array(6).fill(""));
      setStep(2);
      setResendTimer(20);
      alert("OTP sent! Please check your messages.");
    } catch (error) {
      alert("Error sending OTP. Please try again.");
      console.log(error);
      
    } finally {
      setIsLoading(false);  
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        otpRefs.current[index + 1]?.focus();
      }
    }
  };   


  

  const handleOTPSubmit = async ( )=> {
    const formattedPhoneNumber = `${callingCode}${phoneNumber.replace(/\s+/g, "")}`;
    const otpString = otp.join("");
    setPhoneVerified(true);
    router.push("/(auth)/SignUp");
    setIsLoading(true);
    try {
      const response = await  axios.post(`${baseURL}/api/user/send-code`,{
        phoneNumber:formattedPhoneNumber,
        opt:otpString,
      }) 
      setPhoneVerified(true);
      Alert.alert("OTP verified successfully!");
      
    } catch (error) {
      setWrongOtp(true);
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {step === 1 ? (
        <View>
          <Text style={styles.header}>Log in</Text>
          <Text style={styles.subtext}>Please confirm your country code and enter your phone number.</Text>
          <View style={styles.dropdown}>
            <Picker
              selectedValue={selectedCountry}
              onValueChange={(itemValue) => handleCountryChange(itemValue)}
              style={styles.dropdown}
            >
              {countryList.map((country) => (
                <Picker.Item key={country.code} label={`${country.name} (${country.callingCode})`} value={country.code} />
              ))}
            </Picker>
          </View>

          {/* Show the selected country flag and calling code */}
          <View style={styles.flagAndText}>
            <CountryFlag isoCode={selectedCountry} size={24} />
            <Text style={styles.flagText}>{callingCode}</Text>
          </View>

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
              maxLength={15} 
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={() => handleSendOTP(phoneNumber)} disabled={!phoneNumber}>
           {isLoading ? (
                     <ActivityIndicator size="small" color="#FFFFFF" />
                   ) : ( <Text style={styles.buttonText}>Continue</Text>
                   )
                  }
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
                onFocus={() => setWrongOtp(false)}
              />
            ))}
          </View>
          {wrongOtp && <Text style={styles.errorText}>Wrong code, please try again</Text>}
          <TouchableOpacity style={styles.button} onPress={handleOTPSubmit}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (<Text style={styles.buttonText}>Verify</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 28, fontWeight: "bold", marginBottom: 10 },
  subtext: { fontSize: 14, color: "#555", marginBottom: 20 },
  phoneContainer: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  countryCode: { width: 60, height: 50, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, textAlign: "center", marginRight: 10 },
  phoneInput: { flex: 1, height: 50, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, paddingLeft: 10 },
  button: { backgroundColor: "#4F8EF7", borderRadius: 8, paddingVertical: 12, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  dropdown: { marginBottom: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, overflow: "hidden" },
  otpContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  otpInput: { width: 40, height: 50, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, textAlign: "center", fontSize: 20 },
  errorText: { color: "red", textAlign: "center", marginBottom: 10 },
  flagAndText: { flexDirection: "row", alignItems: "center", marginBottom: 10  },
  flagText: { marginLeft: 10, fontSize: 16 },
});

export default LoginWithPhone;
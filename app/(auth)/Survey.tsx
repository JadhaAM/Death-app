import axios from "axios";  
import { Image } from "expo-image";  
import React, { useContext, useState } from "react";  
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, Alert } from "react-native";  
import { AuthContext } from "../AuthContext/AuthContext";  
import { router } from "expo-router";  

const { width } = Dimensions.get("window");  

// Define the Question type  
interface Question {  
  id: number;  
  question: string;  
  options: string[];  
  isVisible: (answers: Record<number, string | null>) => boolean;  
}  

const Survey: React.FC = () => {  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);  
  const [answers, setAnswers] = useState<Record<number, string | null>>({});  
  const { baseURL, authUser, setSurvyDone } = useContext(AuthContext);  

  
 const questions: Question[] = [
  {
    id: 1,
    question: "Are you looking to use our services for yourself or for your relative?",
    options: ["Myself", "Relative"],
    isVisible: () => true,
  },
  {
    id: 2,
    question: "Do you currently have arrangements for a funeral home?",
    options: ["Yes", "No"],
    isVisible: (answers) => answers[1] === "Myself",
  },
  {
    id: 3,
    question: "Do you currently have a cemetary plot?",
    options: ["Yes", "No"],
    isVisible: (answers) => answers[1] === "Myself",
  },
  {
    id: 4,
    question: "Do you currently have a headstone?",
    options: ["Yes", "No"],
    isVisible: (answers) => answers[1] === "Myself",
  },
  {
    id: 5,
    question: "Do you currently have a legal representation of your legacy?",
    options: ["Yes", "No"],
    isVisible: (answers) => answers[1] === "Myself",
  },
  {
    id: 6,
    question: "Do you currently have a life insurance plan to help with your legacy expenses?",
    options: ["Yes", "No"],
    isVisible: (answers) => answers[1] === "Myself",
  },
  {
    id: 7,
    question: "Do you want a free consultation regarding your legacy memorial?",
    options: ["Yes", "No"],
    isVisible: (answers) => answers[1] === "Myself",
  },
  {
    id: 8,
    question: "Does your relative have arrangements for a funeral home?",
    options: ["Yes", "No"],
    isVisible: (answers) => answers[1] === "Relative",
  },
  {
    id: 9,
    question: "Do you currently have a cemetary plot for your loved one?",
    options: ["Yes", "No"],
    isVisible: (answers) => answers[1] === "Relative",
  },
  {
    id: 10,
    question: "Do you currently have a headstone for your loved one?",
    options: ["Yes", "No"],
    isVisible: (answers) => answers[1] === "Relative",
  },
  {
    id: 11,
    question: "Does your relative have a legal representation for their legacy?",
    options: ["Yes", "No"],
    isVisible: (answers) => answers[1] === "Relative",
  },
  {
    id: 12,
    question: "Does your relative have a life insurance plan to help with their legacy expenses?",
    options: ["Yes", "No"],
    isVisible: (answers) => answers[1] === "Relative",
  },
  {
    id: 13,
    question: "Do you want a free consultation regarding your relatives legacy memorial?",
    options: ["Yes", "No"],
    isVisible: (answers) => answers[1] === "Relative",
  },
]; 

  // Filter visible questions dynamically based on answers  
  const visibleQuestions = questions.filter((q) => q.isVisible(answers));  

  // Calculate progress  
  const progress = (currentQuestionIndex / (visibleQuestions.length - 1)) * 100;  

  const handleAnswer = (answer: string) => {  
    const currentQuestion = visibleQuestions[currentQuestionIndex];  
    setAnswers((prev) => ({  
      ...prev,  
      [currentQuestion.id]: answer,  
    }));  
  };  

  const handelNavigation = async () => {  
    const responses = Object.entries(answers).map(([questionId, answer]) => {  
      const questionText = questions.find(q => q.id === parseInt(questionId))?.question;  
      return {  
        question: questionText,  
        answer: answer,  
      };  
    });  

    console.log(responses);  

    try {  
      const response = await axios.post(`${baseURL}/api/user/survey/submit-survey`, {  
        userId: authUser,  
        responses: responses,  
      });  

      if (response.status === 201) {  
        setSurvyDone(true);  
        router.push("/(tabs)/home");  
        Alert.alert('Success', 'Your responses have been submitted successfully!');  
      }  
      console.log('Responses submitted:', response.data);  
    } catch (error) {  
      console.error('Error submitting responses:', error);  
      Alert.alert('Error', 'There was an error submitting your responses.');  
    }  
  };  

  const handleNext = () => {  
    if (currentQuestionIndex < visibleQuestions.length - 1) {  
      setCurrentQuestionIndex(currentQuestionIndex + 1);  
    } else {  
      handelNavigation();  
      Alert.alert("Survey Complete!");  
    }  
  };  

  const handleBack = () => {  
    if (currentQuestionIndex > 0) {  
      setCurrentQuestionIndex(currentQuestionIndex - 1);  
    }  
  };  

  const currentQuestion = visibleQuestions[currentQuestionIndex];  

  return (  
    <SafeAreaView style={styles.container}>  
      {/* Progress Bar */}  
      <View style={styles.progressBarContainer}>  
        <View style={[styles.progressBar, { width: `${progress}%` }]} />  
      </View>  

      {/* Header */}  
      <View style={styles.header}>  
        {currentQuestionIndex > 0 && (  
          <TouchableOpacity onPress={handleBack}>  
            <Text style={styles.backButton}>{"<"}</Text>  
          </TouchableOpacity>  
        )}  
        <Image  
          source={require("../../assets/images/Star 9.png")}  
          style={{ width: 46, height: 44, marginRight: 10 }}  
        />  
      </View>  

      {/* Question Section */}  
      <View style={styles.questionCard}>  
        <Text style={styles.questionText}>{currentQuestion.question}</Text>  
        <View style={styles.optionsContainer}>  
          {currentQuestion.options.map((option, index) => (  
            <TouchableOpacity  
              key={index}  
              style={[  
                styles.radioOption,  
                answers[currentQuestion.id] === option && styles.selectedOption,  
              ]}  
              onPress={() => handleAnswer(option)}  
            >  
              <Text style={styles.optionText}>{option}</Text>  
              <View  
                style={[  
                  styles.radioCircle,  
                  answers[currentQuestion.id] === option && styles.selectedCircle,  
                ]}  
              />  
            </TouchableOpacity>  
          ))}  
        </View>  
      </View>  

      {/* Buttons */}  
      <View style={styles.buttonContainer}>  
        <TouchableOpacity style={styles.skipButton} onPress={handleNext}>  
          <Text style={styles.buttonText}>Skip</Text>  
        </TouchableOpacity>  
        <TouchableOpacity  
          style={[styles.continueButton, !answers[currentQuestion.id] && styles.disabledButton]}  
          onPress={handleNext}  
          disabled={!answers[currentQuestion.id]}  
        >  
          <Text style={styles.buttonText}>Continue</Text>  
        </TouchableOpacity>  
      </View>  
    </SafeAreaView>  
  );  
};  

export default Survey;  

// Styles  
const styles = StyleSheet.create({  
  container: {  
    flex: 1,  
    backgroundColor: "rgb(249, 246, 246)",  
    paddingHorizontal: 20,  
  },  
  header: {  
    flexDirection: "row",  
    alignItems: "center",  
    justifyContent: "space-between",  
    marginBottom: 20,  
  },  
  backButton: {  
    fontSize: 15,  
    fontWeight: "bold",  
    color: "rgb(11, 11, 11)",  
    borderWidth: 1,  
    borderRadius: 6,  
    padding: 8,  
    marginLeft: 10,  
    borderColor: "rgb(11, 11, 11)",  
  },  
  questionCard: {  
    padding: 20,  
    borderRadius: 12,  
    height: 400,  
    margin: 10,  
  },  
  questionText: {  
    fontSize: 28,  
    fontFamily: "Poppins",  
    fontWeight: "400",  
    lineHeight: 36.4,  
    letterSpacing: -0.01,  
    textAlign: "left",  
    color: "#333",  
    marginBottom: 15,  
  },  
  optionsContainer: {  
    marginTop: 10,  
  },  
  radioOption: {  
    flexDirection: "row",  
    alignItems: "center",  
    paddingVertical: 10,  
    paddingHorizontal: 10,  
    marginBottom: 10,  
    backgroundColor: "rgb(249, 246, 246)",  
    borderRadius: 8,  
    borderWidth: 1,  
    borderColor: "rgb(86, 85, 85)",  
  },  
  selectedOption: {  
    borderColor: "rgb(12, 12, 12)",  
    backgroundColor: "rgb(249, 246, 246)",  
  },  
  radioCircle: {  
    width: 20,  
    height: 20,  
    borderRadius: 10,  
    borderWidth: 2,  
    padding: 2,  
    borderColor: "#ccc",  
    marginLeft: 150,  
  },  
  selectedCircle: {  
    borderColor: "rgba(0, 0, 0, 1)",  
    backgroundColor: "rgb(12, 12, 12)",  
    padding: 5,  
  },  
  optionText: {  
    fontSize: 16,  
    color: "#333",  
    marginLeft: 50,  
  },  
  buttonContainer: {  
    flexDirection: "column",  
    justifyContent: "space-between",  
    alignContent: "center",  
    marginTop: 80,  
    gap: 10,  
  },  
  skipButton: {  
    backgroundColor: "rgb(12, 12, 12)",  
    paddingVertical: 12,  
    paddingHorizontal: 20,  
    borderRadius: 15,  
    flex: 1,  
    padding: 10,  
    alignItems: "center",  
    marginHorizontal: 10,  
  },  
  continueButton: {  
    backgroundColor: "#0057FF",  
    paddingVertical: 12,  
    paddingHorizontal: 20,  
    borderRadius: 15,  
    flex: 1,  
    padding: 10,  
    alignItems: "center",  
    marginHorizontal: 10,  
  },  
  disabledButton: {  
    backgroundColor: "#ccc",  
  },  
  buttonText: {  
    color: "#FFF",  
    fontWeight: "bold",  
    fontSize: 16,  
  },  
  progressBarContainer: {  
    height: 10,  
    width: '100%',  
    backgroundColor: '#e0e0e0',  
    borderRadius: 5,  
    overflow: 'hidden',  
    marginBottom: 20, // Space below the progress bar  
  },  
  progressBar: {  
    height: '100%',  
    backgroundColor: '#6200EE', // Progress bar color  
  },  
});
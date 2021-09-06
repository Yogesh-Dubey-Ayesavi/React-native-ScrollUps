import { AuthContext } from './utils';
import React, { useState } from 'react';
import { View, Text,StyleSheet ,TextInput,TouchableOpacity,KeyboardAvoidingView,TouchableWithoutFeedback,ToastAndroid, Button,Keyboard} from 'react-native';
import { Alert } from 'react-native';



function OTP(props){
  const [otpnumber,setNumber]= useState('')
  const confirm = props.route.params.confirm
   const number = props.route.params.number
 


  const {signIn} = React.useContext(AuthContext)
 
  // Loginhandle = (OtpNumber,Confirm,PhoneNumber)=>{
  //    signIn(OtpNumber,Confirm,PhoneNumber);
  // };

const checkmyNumber = (confirm,otpnumber)=>{
    const  OtpVerify = async (confirm,otpnumber) => {
        try {
           let data = await confirm.confirm(otpnumber);
           console.log("data", data);
          props.navigation.navigate("test")
        } catch (error) {null
        // console.log('Invalid code.');
        // ToastAndroid.show('Invalid code.',ToastAndroid.SHORT)
        }
    };

    OtpVerify(confirm,otpnumber);
  };



    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
      <View style={styles.container} >
        
         <KeyboardAvoidingView behavior={"padding"}>
          <TextInput
           style={styles.InputText}
           keyboardType={"number-pad"}
           maxLength={6}
           placeholder="Enter Otp"
           textAlign={"center"}
           placeholderTextColor={"#EBEBF5"}
           onChangeText = {(value)=>setNumber(value)}
          ></TextInput>
          </KeyboardAvoidingView>
          <Text style = {styles.OtherTexts}>Your Mobile Number You've Set</Text>
          <Text style ={{
            marginTop:"2%",
            color:"#FFFFFF",
            alignSelf:'center'
          }}>
            8319768418
          </Text>
          <View style={{
            flexDirection:"row",
            justifyContent:"space-between",
            marginTop:50,
          }}>
            <TouchableOpacity>
              <Text style= {styles.leftResendOtp}>
                 ResendOtp
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
            <Text style= {styles.RightEdit} >
                 EDIT
              </Text>
            </TouchableOpacity>

          </View>

          <Button title = {"Submit"} onPress={()=>{checkmyNumber(confirm,otpnumber)}}></Button>
     </View> 

     </TouchableWithoutFeedback>
     
    );
  };

  const styles = StyleSheet.create({
  
    container:{
      justifyContent:'center',
    //  alignItems:"center",
      flex:1,
      backgroundColor:"#000000",
    },
    InputText:{
    
      alignSelf:"center",
      height:"25%",
      width:"80%",
      color:"white",
     backgroundColor:"#767680",
     borderRadius:25,
     elevation:1,
     shadowColor:"white"
    },
    OtherTexts:{
      marginTop:"5%",
      color:"#FFFFFF",
      alignSelf:'center'

    },
    RightEdit:{
      color:"#0276FD",
      fontWeight:"bold",
      marginRight:10,
      fontSize:15,
    },
   leftResendOtp:{
      color:"#0276FD",
      fontWeight:"bold",
      marginLeft:10,
      fontSize:15,
    }




  });
  



  export default OTP;


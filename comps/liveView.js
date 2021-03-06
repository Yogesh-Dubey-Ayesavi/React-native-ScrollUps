import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
} from 'react-native-webrtc';
import React,{useState,useEffect} from 'react';
import {StatusBar,Button,View,Dimensions,FlatList} from 'react-native';
import {useSelector,useDispatch} from 'react-redux'
import array from '../APIS/static APIS/GetData API';
import Posts from '../APIS/PostsDesc';
import RenderItem from './../APIS/Webrtc and Sockets/RenderItem';
import Socket from './../APIS/Webrtc and Sockets/SOCKETS';
const windowHeight = Dimensions.get('window').height;



const SIGNALING_SERVER_URL = 'http://192.168.0.103:9999';
const TURN_SERVER_URL = '13.233.167.171:3478';
const TURN_SERVER_USERNAME = 'user';
const TURN_SERVER_CREDENTIAL = 'root';
const PC_CONFIG = {
  iceServers: [
    {
      urls: 'turn:' + TURN_SERVER_URL + '?transport=tcp',
      username: TURN_SERVER_USERNAME,
      credential: TURN_SERVER_CREDENTIAL
    },
    {
      urls: 'turn:' + TURN_SERVER_URL + '?transport=udp',
      username: TURN_SERVER_USERNAME,
      credential: TURN_SERVER_CREDENTIAL
    }
  ]
};

var PC;
const ScrollUp = () =>{

   
    const ReduxStore = useSelector((state)=>state)
    const dispatch = useDispatch()
    const URL = "wss://2ywi2ldinf.execute-api.ap-south-1.amazonaws.com/production"

   
    useEffect(()=>{

        Ws.onopen = () => {
            console.log("Console.log WebSocket connected ")
        }

    },[])

    const Ws = new WebSocket(URL)

    

  const fetch_USERS = () =>{
    PC = new RTCPeerConnection(PC_CONFIG)
    Ws.send(JSON.stringify({
        action:"default",
    }))
  }

   let PartnerID ;
  
    Ws.onmessage = (entity)=>{ 
    mesage = JSON.parse(entity.data)
    if (mesage.type!="data"){
    console.log(mesage)
    }
   
    switch(mesage.type){
        case "data":
            handleSignalingData(mesage.data)
            break;
        case "ByanotherUser":
           PartnerID =mesage.PartnerConnectionID
            break; 
        case "Ready":
          PartnerID = mesage.PartnerConnectionID
            createPeerConnection()
            sendOffer()
            
        }

}



    const sendData = (DATAS) =>{

        
        Ws.send(JSON.stringify({
            action:"connecTo",
            data : DATAS,
            PartnerConnectionID :PartnerID,
        })     )
        
    }

    const createPeerConnection = () =>{
    
      try {
       
          PC.onicecandidate  =  event  =>{
            if (event.candidate) {
              // console.log('ICE candidate');
             sendData({
                type: 'candidate',
                candidate: event.candidate
              });
            }

      }
           PC.onaddstream = event =>{
          //  console.log("Add Stream")
          dispatch({type:"REMOTE_Stream",data:event.stream});
     //      console.log("REDUXSTORE NUM ", ReduxStore.Num )
           dispatch({type:"REMOTE_STREAM_OBTAINED",data:true})
        } 
        PC.addStream(ReduxStore.LocalStream)  
       //    console.log("PeerConnectionCreated")
          
        } catch (error) {
            console.error(error)
        }
    }
    


    const sendOffer = () => {
            PC.createOffer({}).then((description)=>{
            setAndSendLocalDescription(description),
            (error) => { console.error('Send offer failed: ', error); }
          }  
          );
    }

    const sendAnswer = () =>{
       //console.log(" Answer Send ")
       PC.createAnswer().then((description)=>{
         setAndSendLocalDescription(description),
         (error)=>{console.error(error)}
       }

       );
    };
    
      const setAndSendLocalDescription = (description) =>{
        PC.setLocalDescription(description);
        // console.log("Local des")
        sendData(description)
      };    
   
      
     const handleSignalingData = (data) => {
        switch (data.type) {
          case 'offer':
           createPeerConnection();
            // console.log("Recieved Offer")
            PC.setRemoteDescription(new RTCSessionDescription(data));
            sendAnswer();
             // console.log("Send Answer")
            break;
          case 'answer':
             // console.log("recieved answer")
            PC.setRemoteDescription(new RTCSessionDescription(data));
            break;
          case 'candidate':
             // console.log("ICE candidates ")
            PC.addIceCandidate(new RTCIceCandidate(data.candidate));
            break;
        }
      };








 const ScrollOnEvent = (PC) => {
 
  
    dispatch({type:"REMOTE_Stream",data: {toURL:() => null}})
  

   
    dispatch({type:"UPDATE NUM"})
    console.log(ReduxStore.Num)
    var data = Posts[ReduxStore.Num]
    dispatch({type : "UP_DATE_USER_INITIAL_ID",data: data})
        console.log(ReduxStore.Num, "Num" ) 
        if ( ReduxStore.Num > 0){
          console.log("CLOSE FUNCTION COMPLETED",PC)
          PC.close()
          dispatch({type :"REMOTE_STREAM_OBTAINED",data : false}) 
    }
    fetch_USERS()

} 



    return(
        <View>
            <StatusBar       
            hidden = {false} translucent = {true} />
            <FlatList
            data = {array}
            renderItem = {({item})=><RenderItem id = {item.id} pc = {PC}/>}
            keyExtractor = {(item)=>item.id}
            snapToInterval = {windowHeight+ StatusBar.currentHeight}
            disableScrollViewPanResponder = {true}
            disableInpppppppppppppppppppppppppppppppppppppppppppppppppppppppppppptervalMomentum = {true}
            onScrollEndDrag = {() =>ScrollOnEvent(PC)}
           />       
        </View>
    )
}                


export default ScrollUp;
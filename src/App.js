import logo from './logo.svg';
import './App.css';
import { useRef, useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import Speech from './speech';
import axios from 'axios';
// import microPhoneIcon from "./microphone.svg";

function App() {
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);
  const [speakTime, setSpeakTime] = useState(false)
  const [response, setResponse] = useState("Hi i am here to help")
  const microphoneRef = useRef(null);
  // useEffect(() => {
  //   fetch("https://")
  //     .then(response => response.json())
  //     .then((data) => {
  //       console.log("here is data", data)
  //       setResponse(data);
  //     })
  // }, [speakTime])

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return (
      <div className="mircophone-container">
        Browser is not Support Speech Recognition.
      </div>
    );
  }
  const handleListing = () => {
    setIsListening(true);
    microphoneRef.current.classList.add("listening");
    SpeechRecognition.startListening({
      continuous: true,
    });
  };
  const stopHandle = () => {
    setIsListening(false);
    microphoneRef.current.classList.remove("listening");
    SpeechRecognition.stopListening();
    console.log("here transcript", transcript)
    // axios.post(`https://`, {
    //   transcript
    // }).then((data) => {
    //   setResponse(data)
    // })
    setSpeakTime(true);
  };
  const handleReset = () => {
    stopHandle();
    resetTranscript();
  };

  return (
    <div className="microphone-wrapper">
      <h1> Practice English Chatbot </h1>
      <div className="mircophone-container">
        <div
          className="microphone-icon-container"
          ref={microphoneRef}
          onClick={handleListing}
        >
          {/* <img className="microphone-icon" src= alt='MIC' /> */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z"/></svg>
        </div>
        <div className="microphone-status">
          {isListening ? "Listening........." : "Click to start Listening"}
        </div>
        {isListening && (
          <button className="microphone-stop btn" onClick={stopHandle}>
            Stop
          </button>
        )}
      </div>
      {transcript && (
        <div className="microphone-result-container">
          <div className="microphone-result-text">{transcript}</div>
          <div className="microphone-result-text">{response}</div>
          <div>
            <Speech
            response = {response}
            />
          </div>
          <button className="microphone-reset btn" onClick={handleReset}>
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

export default App;

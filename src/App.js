import logo from "./logo.svg";
import "./App.css";
import React, { useRef, useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Speech from "./speech";
import axios from "axios";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import LoadingOverlay from "react-loading-overlay";
const animatedComponents = makeAnimated();

// import microPhoneIcon from "./microphone.svg";

const hobbiesOptions = [
  { value: "riding-bike", label: "Riding Bike" },
  { value: "racing", label: "Racing" },
  { value: "playing-indoor-games", label: "Playing Indoor Games" },
  { value: "playing-outdoor-games", label: "Playing Outdoor Games" },
  { value: "reading-books", label: "Reading Books" },
  { value: "dancing", label: "Dancing" },
  { value: "singing", label: "Singing" },
  { value: "coding", label: "Coding" },
];

const levelOptions = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

let count = 0;
function App() {
  const [isFetching, updateFetching] = useState(false);

  const [selectedHobbies, updateHobbies] = useState(null);
  const [selectedLevel, updateLevels] = useState(null);

  const { transcript, resetTranscript } = useSpeechRecognition();

  const [errors, setErrors] = useState(null);

  const [clicked, updateClicked] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const [speakTime, setSpeakTime] = useState(false);

  const [apiResponse, setResponse] = useState([]);

  const microphoneRef = useRef(null);

  const nameRef = useRef(null);

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    let name = nameRef.current.value;
    if (name.trim().length == 0) {
      return setErrors("Please type your Name!");
    }

    if (selectedHobbies == null || selectedHobbies.length == 0) {
      return setErrors("Please select your Hobbies!");
    }
    let hobbies = selectedHobbies.map((item) => item.label);

    if (selectedLevel == null || selectedLevel.length == 0) {
      return setErrors("Please select your English Level!");
    }
    let level = selectedLevel.label;

    axios.post(
      "https://20007.stg.doubtnut.com/v1/lang-buddy/setLangBudUserDetails",
      {
        name,
        hobbies,
        level,
      },
      {
        timeout: 5000,
      }
    );
    // .then((_) => );

    updateClicked(true);
    setErrors(null);
  };

  React.useEffect(() => {
    if (count == 0 && clicked == true) {
      updateFetching(true);
      count++;

      axios
        .post(
          `https://20007.stg.doubtnut.com/v1/lang-buddy/getLangBuddy`,
          {},
          {
            timeout: 300000,
          }
        )
        .then((response) => {
          setResponse((previousArr) => {
            const copyArr = [...previousArr];
            copyArr.push(response.data.data.result);
            updateFetching(false);

            return copyArr;
          });
        });
    }
  }, [clicked]);

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
    updateFetching(true);

    microphoneRef.current.classList.remove("listening");
    SpeechRecognition.stopListening();
    // console.log("here transcript", transcript);
    axios
      .post(
        `https://20007.stg.doubtnut.com/v1/lang-buddy/getLangBuddy`,
        {
          transcript,
        },
        {
          timeout: 300000,
        }
      )
      .then((response) => {
        // console.log(response);

        //response.data.resArr
        setResponse((previousArr) => {
          const copyArr = [...previousArr];
          copyArr.push(response.data.data.result);
          updateFetching(false);
          setTimeout(() => {
            scrollToBottom();
          }, 1000);
          return copyArr;
        });
        // setTeacherResponse(data.data.resp.choices[0].message.teacher);
        resetTranscript();
      });
    setSpeakTime(true);
  };
  const handleReset = () => {
    stopHandle();
    resetTranscript();
    setResponse([]);
  };

  return (
    <div className="microphone-wrapper">
      {/* {isFetching && <div className="loading">Loading</div>} */}
      <div style={{ textAlign: "center" }}>
        <h1 className="title"> Hello Bache! </h1>
        <p className="subtitle"> Main hu aapka </p>
        <img
          width={200}
          height="auto"
          src="https://d10lpgp6xz60nq.cloudfront.net/engagement_framework/DA24452C-32C8-7BA2-6735-281B6F5870B9.webp"
          alt="lang buddy logo"
        />
      </div>

      {clicked == false && (
        <>
          <form className="user-form">
            {errors && (
              <h2 style={{ background: "red", color: "white" }}>{errors}</h2>
            )}

            <div>
              <label htmlFor="user-name">Aapka Naam ?</label>
              <input
                style={{ display: "block" }}
                type="text"
                id="user-name"
                ref={nameRef}
              />
            </div>

            <div>
              <h2>Aapke Hobbies kya hai?</h2>
              {/* <div>
                <input
                  type="checkbox"
                  id="bike"
                  name="bike"
                  value="riding bike"
                />
                <label for="bike"> Riding Bike</label>

                <input type="checkbox" id="car" name="car" value="racing car" />
                <label for="car"> Racing</label>

                <input
                  type="checkbox"
                  id="game"
                  name="games"
                  value="playing games"
                />
                <label for="game"> Playing games</label>
              </div> */}

              <div style={{ color: "black" }}>
                <Select
                  isMulti
                  defaultValue={selectedHobbies}
                  onChange={updateHobbies}
                  options={hobbiesOptions}
                  components={animatedComponents}
                />
              </div>
            </div>

            <div>
              <h2>Aapka English Level Kya hai?</h2>

              <div style={{ color: "black" }}>
                <Select
                  defaultValue={selectedLevel}
                  onChange={updateLevels}
                  options={levelOptions}
                />
              </div>
            </div>
          </form>

          <button
            className="btn"
            type="submit"
            onClick={onSubmit}
            style={{ margin: "auto" }}
          >
            Start
          </button>
        </>
      )}

      <LoadingOverlay active={isFetching} spinner text="Loading ...">
        {clicked && (
          <div className="mircophone-container">
            <div
              className="microphone-icon-container"
              ref={microphoneRef}
              onClick={handleListing}
            >
              {/* <img className="microphone-icon" src= alt='MIC' /> */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                <path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z" />
              </svg>
            </div>
            <div className="microphone-status">
              {isListening ? "Listening........." : "Tap to Speak"}
            </div>
            {isListening && (
              <button className="microphone-stop btn" onClick={stopHandle}>
                Stop
              </button>
            )}
          </div>
        )}

        {clicked && (
          <div className="microphone-result-container">
            <div
              className="flex column"
              style={{
                gap: "2.5em",
                height: "70vh",
                overflow: "auto",
                maxWidth: "50rem",
              }}
            >
              {apiResponse.map(renderChats)}
            </div>
            <div
              className="flex flex-wrap gap-1"
              style={{ marginTop: "2em", padding: "1em" }}
            >
              {/* send the last response from the api (last item in the arrray)  convo*/}
              <Speech
                text="English Bandhu"
                response={
                  apiResponse[apiResponse.length - 1] &&
                  apiResponse[apiResponse.length - 1].english_bandhu
                }
              />
              <Speech
                text="Teacher"
                response={
                  apiResponse[apiResponse.length - 1] &&
                  apiResponse[apiResponse.length - 1].teacher
                }
              />

              <button className="microphone-reset btn" onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>
        )}
      </LoadingOverlay>
    </div>
  );

  function renderChats(item, index) {
    return (
      <div
        className="flex column"
        style={{ gap: "1em" }}
        key={index.toString()}
        ref={messagesEndRef}
      >
        <div className="flex">
          {item.user && (
            <div className="border grow">
              <strong>{item.name}</strong>: {item.user}
            </div>
          )}

          {item.teacher && (
            <div style={{ background: "red" }} className="border">
              <strong>Teacher</strong>: {item.teacher}
            </div>
          )}
        </div>

        {item.english_bandhu && (
          <div className="border">
            <strong>English Bandhu</strong>: {item.english_bandhu}
          </div>
        )}
      </div>
    );
  }
}

export default App;

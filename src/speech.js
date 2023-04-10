
import React from "react";
import { useRef, useState, useEffect } from "react";
import { useSpeechSynthesis } from "react-speech-kit";
import './speech.css';

const Speech = ({ response }) => {
    let [value, setValue] = React.useState("");
    const { speak } = useSpeechSynthesis();
    //   useEffect(() => {
    //     fetch("https://")
    //       .then(response => response.json())
    //       .then((data) => {
    //         console.log("here is data", data)
    //         setValue(data);
    //       })
    //   }, [value])
    return (
        // <div className="speech">
        //   <div className="group">
        //   </div>
        //   <div className="group">
        //     <textarea
        //       rows="10"
        //       value={value}
        //       onChange={(e) => setValue(e.target.value)}
        //     ></textarea>
        //   </div>
        //   <div className="group">
        //     <button onClick={() => speak({ text: value })}>
        //       Speech
        //     </button>
        //   </div>
        // </div>

        <>
            <button
            style={{ background: 'rgb(227, 240, 219)', color: 'rgb(10, 10, 10)', width: '100%', 
            cursor: 'pointer'}}
            onClick={() => speak({ text: response })}>Play Audio</button >
    </>
  );
};
export default Speech;
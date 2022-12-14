import Angry from "../assets/Designs/Chameleon_Angry.png";
import Confused from "../assets/Designs/Chameleon_Confused.png";
import Excited from "../assets/Designs/Chameleon_Excited.png";
import Grin from "../assets/Designs/Chameleon_Grin.png";
import Neutral from "../assets/Designs/Chameleon_Neutral.png";
import Pressure from "../assets/Designs/Chameleon_pressure_big.png";
import SadOpenMouth from "../assets/Designs/Chameleon_Sad (Open).png";
import Sad from "../assets/Designs/Chameleon_Sad.png";
import Shrug from "../assets/Designs/Chameleon_Shrug.png";
import Ouch from "../assets/Sounds/ouch.mp3";
import Crying from "../assets/Sounds/crying.mp3";
import ProgressBar from "./ProgressBar";

import Logo from "../assets/Logo.png";
import LandingPage from "./LandingPage";
import Dashboard from "./Dashboard";

import useStickyState from "../hooks/useStickyState";

import styles from "./Chat.module.css";
import React, { useState, useEffect } from "react";
import { WindupChildren } from "windups";

const Chat = () => {
  const determineTimeOfDay = () => {
    const date = new Date();
    const hour = date.getHours();
    if (hour >= 0 && hour < 6) {
      return "night";
    } else if (hour >= 6 && hour < 11) {
      return "morning";
    } else if (hour >= 12 && hour < 17) {
      return "afternoon";
    } else {
      return "evening";
    }
  };

  const [emotion, setEmotion] = useState(Neutral);
  const [isLoading, setIsLoading] = useState(true);
  const [pokeCounter, setPokeCounter] = useState(0);
  const [totalPokes, setTotalPokes] = useStickyState(0, "pokeCounter");
  const [statusBarUpdate, setStatusBarUpdate] = useState(0);
  const [statusBarColour, setStatusBarColour] = useState("#68b2c1");
  const [message, setMessage] = useState(
    <WindupChildren>
      Good {determineTimeOfDay()}! How was your day?
    </WindupChildren>
  );

  const [register, setRegister] = useStickyState({
    sad: 50,
    confused: 50,
    happy: 50,
  });

  const [isDashboard, setIsDashboard] = useState(false);
  const pissedArray = [Angry, Shrug];

  useEffect(() => {
    let timer;

    const images = [
      Grin,
      Angry,
      Confused,
      Excited,
      Neutral,
      Pressure,
      SadOpenMouth,
      Sad,
      Shrug,
    ];
    images.forEach((image) => {
      new Image().src = image;
    });

    if (pokeCounter > 4) {
      setPokeCounter(0);
    }
    const crying = new Audio(Crying);

    if (pokeCounter === 5) {
      setEmotion(Pressure);

      // Every 15 pokes, playing the crying sound
      if (totalPokes % 3 === 0) {
        crying.play();
      }

      setMessage(
        <WindupChildren>I'm sorry, I'm not feeling well.</WindupChildren>
      );

      timer = setTimeout(() => {
        crying.pause();
      }, 2400);
    }

    if (emotion === SadOpenMouth) {
      timer = setTimeout(() => {
        setEmotion(Sad);

        setMessage(<WindupChildren>{"What's wrong?"}</WindupChildren>);
      }, 2000);
    } else if (emotion === Pressure) {
      
      timer = setTimeout(() => {
        setEmotion(emotionsArray[Math.floor(Math.random() * pissedArray.length)]);

        setMessage(
          <WindupChildren>
            Please stop poking me!
          </WindupChildren>
        );
      }, 3000);
    } else {
      timer = setTimeout(() => {
        setMessage(
          <WindupChildren>
            How was your day?
          </WindupChildren>
        );

        setEmotion(Neutral);
      }, 3000);
    }

    if (statusBarUpdate >= 100) {
      setStatusBarUpdate(100);
      return;
    }

    // Finish loading after 5 seconds
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [emotion, pokeCounter, totalPokes, statusBarUpdate]);

  const ouch = new Audio(Ouch);
  const emotionsArray = [Angry, Shrug, Grin];

  const emotionHandler = () => {
    setEmotion(emotionsArray[Math.floor(Math.random() * emotionsArray.length)]);

    setPokeCounter(pokeCounter + 1);
    setTotalPokes(totalPokes + 1);

    ouch.play();
  };

  const happyHandler = () => {
    setEmotion(Excited);
    setStatusBarColour("#3cae3c");
    if (statusBarUpdate < 100) {
      setStatusBarUpdate(statusBarUpdate + 10);
    }

    setRegister({ ...register, happy: register.happy + 100 });

    setMessage(
      <WindupChildren>{"That's amazing! I'm so happy for you!"}</WindupChildren>
    );
  };

  const mehHandler = () => {
    setStatusBarColour("#29a7aa");
    setEmotion(Confused);

    if (statusBarUpdate < 100) {
      setStatusBarUpdate(statusBarUpdate + 5);
    }

    setRegister({ ...register, confused: register.confused + 100 });

    setMessage(<WindupChildren>{"Why, what's up?"}</WindupChildren>);
  };

  const sadHandler = () => {
    setStatusBarColour("#3935a8");
    setEmotion(SadOpenMouth);

    if (statusBarUpdate > 1) {
      setStatusBarUpdate(statusBarUpdate - 2);
    }

    setRegister({ ...register, sad: register.sad + 100 });

    setMessage(
      <WindupChildren>{"Aw, you wanna talk about it?"}</WindupChildren>
    );
  };

  const dashboardViewHandler = () => {
    setIsDashboard(!isDashboard);
  };

  const reloadPage = (reloadPage) => {
    window.location.reload();
  };

  return (
    <div className={styles.wrapper}>
      {/* NAVBAR */}
      <div className={styles.navbar}>
        <img
          onClick={reloadPage}
          style={{ cursor: "pointer" }}
          src={Logo}
          alt="chamelii-logo"
        />
        <h1
          onClick={dashboardViewHandler}
          style={{ cursor: "pointer", color: "white" }}
        >
          Dashboard
        </h1>
      </div>
      {/* LANDING PAGE */}
      {isLoading && <LandingPage />}
      {/* CHATBOT */}
      {!isLoading && !isDashboard && (
        <>
          <h2 style={{ marginBottom: "10px" }}>Hi, I'm a chamelii.</h2>

          <div className={styles.border}>
            <img
              className={emotion === Pressure ? styles.pressure : ""}
              src={emotion}
              alt={`${String(emotion).split("/")[3].split(".")[0]}`}
              onMouseDown={emotion === Neutral ? emotionHandler : null}
              onMouseUp={() =>
                emotion === Shrug || emotion === Angry || emotion === Grin
                  ? setEmotion(Neutral)
                  : null
              }
            />
          </div>

          <ProgressBar
            bgcolor={statusBarColour}
            progress={statusBarUpdate}
            height={30}
          />

          <div className={styles.text}>
            <h2 style={{ height: "60px" }}>{message}</h2>
            <button className={styles.btn} onClick={happyHandler}>
              My day was great!
            </button>
            <button className={styles.btn} onClick={mehHandler}>
              My day was fine.
            </button>
            <button className={styles.btn} onClick={sadHandler}>
              I had a really bad day.
            </button>
          </div>

          <p style={{ marginTop: "20px" }}>
            You poked me {totalPokes} times so far.
          </p>
        </>
      )}
      {/* DASHBOARD */}
      {!isLoading && isDashboard && <Dashboard data={register} />}
    </div>
  );
};

export default Chat;

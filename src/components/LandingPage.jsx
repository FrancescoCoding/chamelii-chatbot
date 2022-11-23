import React from "react";
import { WindupChildren, Pause } from "windups";
import Grin from "../assets/Designs/Chameleon_Grin.png";

import styles from "./LandingPage.module.css";

const LandingPage = () => {
  return (
    <>
      <img src={Grin} alt="Chameleon" className={styles.loader} />
      <WindupChildren>
        <h4>Welcome to the Chamelii Chatbot Prototype...</h4>
        <Pause ms={800} />
        <h1>
          Developed and designed by the{" "}
          <span className={styles.karma}>Karma</span> team!
        </h1>
      </WindupChildren>
    </>
  );
};

export default LandingPage;
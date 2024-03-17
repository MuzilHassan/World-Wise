import React from "react";
import styles from "./CityItem.module.css";
import { formatDate, flagemojiToPNG } from "./helperFunction";

const CityItem = ({ city: { cityName, date, emoji } }) => {
  return (
    <li className={styles.cityItem}>
      <div style={{ display: "flex", gap: "1.3rem", alignItems: "center" }}>
        <span className={styles.emoji}>{flagemojiToPNG(emoji)}</span>
        <h3 className={styles.cityName}>{cityName}</h3>
      </div>
      <div style={{ display: "flex", gap: "1.3rem", alignItems: "center" }}>
        <time className={styles.date}>{formatDate(date)}</time>
        <button className={styles.deleteBtn}>&times;</button>
      </div>
    </li>
  );
};

export default CityItem;

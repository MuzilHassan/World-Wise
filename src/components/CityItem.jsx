import React from "react";
import styles from "./CityItem.module.css";
import { formatDate, flagemojiToPNG } from "./helperFunction";
import { Link } from "react-router-dom";

const CityItem = ({
  city: {
    cityName,
    date,
    emoji,
    id,
    position: { lat, lng },
  },
}) => {
  return (
    <li>
      <Link className={styles.cityItem} to={`${id}?lat=${lat}&lng=${lng}`}>
        <div style={{ display: "flex", gap: "1.3rem", alignItems: "center" }}>
          <span className={styles.emoji}>{flagemojiToPNG(emoji)}</span>
          <h3 className={styles.cityName}>{cityName}</h3>
        </div>
        <div style={{ display: "flex", gap: "1.3rem", alignItems: "center" }}>
          <time className={styles.date}>{formatDate(date)}</time>
          <button className={styles.deleteBtn}>&times;</button>
        </div>
      </Link>
    </li>
  );
};

export default CityItem;

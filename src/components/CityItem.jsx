import React from "react";
import styles from "./CityItem.module.css";
import { formatDate, flagemojiToPNG } from "./helperFunction";
import { Link } from "react-router-dom";
import { useCities } from "../context/CitiesContext";

const CityItem = ({
  city: {
    cityName,
    date,
    emoji,
    id,
    position: { lat, lng },
  },
}) => {
  const { currentCity, deleteCity } = useCities();
  const HandleClick = (e) => {
    e.preventDefault();
    deleteCity(id);
  };
  return (
    <li>
      <Link
        className={`${styles.cityItem}  ${
          currentCity.id === id ? styles["cityItem--active"] : ""
        }`}
        to={`${id}?lat=${lat}&lng=${lng}`}
      >
        <div style={{ display: "flex", gap: "1.3rem", alignItems: "center" }}>
          <span className={styles.emoji}>{flagemojiToPNG(emoji)}</span>
          <h3 className={styles.cityName}>{cityName}</h3>
        </div>
        <div style={{ display: "flex", gap: "1.3rem", alignItems: "center" }}>
          <time className={styles.date}>{formatDate(date)}</time>
          <button className={styles.deleteBtn} onClick={HandleClick}>
            &times;
          </button>
        </div>
      </Link>
    </li>
  );
};

export default CityItem;

import React from "react";
import Message from "./Message";
import Spinner from "./Spinner";
import styles from "./CountryList.module.css";
import CountryItem from "./CountryItem";
const CountriesList = ({ isLoading, cities }) => {
  if (isLoading) return <Spinner />;
  if (cities.length === 0)
    return <Message message="Add some countries to your List First" />;
  return (
    <ul className={styles.countryList}>
      {cities.map((country) => (
        <CountryItem
          country={{ country: country.country, emoji: country.emoji }}
        />
      ))}
    </ul>
  );
};

export default CountriesList;

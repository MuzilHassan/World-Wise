import React from "react";
import Message from "./Message";
import Spinner from "./Spinner";
import styles from "./CountryList.module.css";
import CountryItem from "./CountryItem";
import { useCities } from "../context/CitiesContext";
const CountriesList = () => {
  const { isLoading, cities } = useCities();
  if (isLoading) return <Spinner />;
  if (cities.length === 0)
    return <Message message="Add some countries to your List First" />;

  const countries = cities.reduce((arr, city) => {
    if (!arr.map((cur) => cur.country).includes(city.country))
      return [...arr, { country: city.country, emoji: city.emoji }];
    else return arr;
  }, []);
  return (
    <ul className={styles.countryList}>
      {countries.map((country, i) => (
        <CountryItem country={country} key={i} />
      ))}
    </ul>
  );
};

export default CountriesList;

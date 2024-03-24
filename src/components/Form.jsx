// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import Message from "./Message";
import Spinner from "./Spinner";
import { flagemojiToPNG } from "./helperFunction";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../context/CitiesContext";
export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [emoji, setEmoji] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const { addCity } = useCities();
  const key = "65ff3e862d985792414042xahdf7625";
  useEffect(() => {
    async function afetchCityData() {
      try {
        setError("");
        setLoading(true);
        // const res = await fetch(
        //   `https://api.bigdatacloud.net/data//data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
        // );
        const res = await fetch(
          `https://geocode.maps.co/reverse?lat=${lat}&lon=${lng}&api_key=65ff3e862d985792414042xahdf7625`
        );
        if (res.status == 429)
          throw new Error(
            "Too many Requests please try again 30 milli seconds later"
          );
        const data = await res.json();

        if (data.error)
          throw new Error(
            "This dosent seems to be a city, please click on seomewhere else"
          );

        setCityName(
          data.address?.town ||
            data.address?.county ||
            data.address?.state_district ||
            data.address?.district ||
            data.address?.village ||
            data?.display_name
        );
        setCountry(data.address?.country);
        setEmoji(convertToEmoji(data.address?.country_code));
        setError("");
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    if (!lat && !lng) return;

    afetchCityData();
  }, [lat, lng]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!country || !cityName || !emoji) return;

    const cityData = {
      cityName,
      country,
      emoji,
      position: {
        lat,
        lng,
      },
      notes,
      date,
    };
    await addCity(cityData);
    setCityName("");
    setCountry("");
    setEmoji("");
    setNotes("");
    navigate("/app/cities");
  };
  if (loading) return <Spinner />;
  if (error) return <Message message={error} />;
  if (!lat && !lng)
    return (
      <Message message={"Thera are no values for latitued and longitutde"} />
    );
  return (
    <form
      className={`${styles.form} ${loading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        {<span className={styles.flag}>{flagemojiToPNG(emoji)}</span>}
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>

        <DatePicker
          selected={date}
          onChange={(date) => setDate(date)}
          id="date"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <Button
          type="back"
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
        >
          &larr; Back
        </Button>
      </div>
    </form>
  );
}

export default Form;

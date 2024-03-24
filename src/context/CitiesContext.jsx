import { createContext, useContext, useEffect, useState } from "react";
const BASE_URL = "http://localhost:8000/";
const CitiesContext = createContext();

const CitiesProvider = function ({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});
  const getCity = async (id) => {
    console.log(id);
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}cities/${id}`);
      const data = await res.json();
      setCurrentCity(data);
      setLoading(false);
    } catch (error) {
      console.log(error.message, error);
    }
  };
  const addCity = async (cityData) => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}cities/`, {
        method: "POST",
        body: JSON.stringify(cityData),
        headers: {
          "Content-Type": "Applicaton/json",
        },
      });
      const data = await res.json();
      setCities([...cities, data]);
      setLoading(false);
    } catch (error) {
      console.log(error.message, error);
    }
  };
  const deleteCity = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}cities/${id}`, {
        method: "DELETE",
      });

      setCities((cities) => cities.filter((city) => city.id !== id));
      setLoading(false);
    } catch (error) {
      console.log(error.message, error);
    }
  };
  useEffect(() => {
    async function fetchCities() {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}cities`);
        const data = await res.json();
        setCities(data);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchCities();
  }, []);
  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        setCities,
        setLoading,
        getCity,
        currentCity,
        addCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
};

const useCities = () => {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("Cities Context was used outside provider component");
  return context;
};
export { useCities, CitiesProvider };

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
const BASE_URL = "http://localhost:8000/";
const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};
const reducer = (state, action) => {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return {
        ...state,
        cities: action.payload,
        isLoading: false,
      };
    case "city/loaded":
      return {
        ...state,
        currentCity: action.payload,
        isLoading: false,
      };
    case "city/added":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        isLoading: false,
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
      };
    case "error":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    default:
      throw new Error("Unknown action");
  }
};
const CitiesProvider = function ({ children }) {
  const [{ currentCity, isLoading, cities, error }, dispatch] = useReducer(
    reducer,
    initialState
  );
  // const [cities, setCities] = useState([]);
  // const [isLoading, setLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});
  const getCity = async (id) => {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}cities/${id}`);
      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data });
      // setCurrentCity(data);
      // setLoading(false);
    } catch (error) {
      dispatch({
        type: "error",
        payload: "Something went wrong while fetching City data",
      });
    }
  };
  const addCity = async (cityData) => {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}cities/`, {
        method: "POST",
        body: JSON.stringify(cityData),
        headers: {
          "Content-Type": "Applicaton/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "city/added", payload: data });
      // setCities([...cities, data]);
      // setLoading(false);
    } catch (error) {
      dispatch({
        type: "error",
        payload: "Something went wrong while fetching City data",
      });
    }
  };
  const deleteCity = async (id) => {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payload: id });
      // setCities((cities) => cities.filter((city) => city.id !== id));
      // setLoading(false);
    } catch (error) {
      dispatch({
        type: "error",
        payload: "Something went wrong while fetching City data",
      });
    }
  };
  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
        // setCities(data);
        // setLoading(false);
      } catch (error) {
        dispatch({
          type: "error",
          payload: "Something went wrong while fetching City data",
        });
      }
    }
    fetchCities();
  }, []);
  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,

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

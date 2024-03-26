import { createContext, useContext, useReducer } from "react";

const UserContext = createContext();
const initialState = {
  user: null,
  isLoggedIn: false,
};
const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};
const reducer = function (state, action) {
  console.log(action.payload);
  switch (action.type) {
    case "Login":
      return { ...state, user: action.payload, isLoggedIn: true };

    case "Logout":
      return { ...state, user: null, isLoggedIn: false };

    default:
      throw new Error("un Known Action");
  }
};
const UserProvider = ({ children }) => {
  const [{ user, isLoggedIn }, dispatch] = useReducer(reducer, initialState);
  const login = function (email, password) {
    if (email == FAKE_USER.email && password === FAKE_USER.password)
      return dispatch({ type: "Login", payload: FAKE_USER });
    alert("Wrong email or password");
  };
  const logout = function () {
    dispatch({ type: "Logout" });
  };
  return (
    <UserContext.Provider value={{ isLoggedIn, login, logout, user }}>
      {children}
    </UserContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(UserContext);
  if (context === undefined)
    throw new Error("Auth context was used outside provider");
  return context;
};
export { useAuth, UserProvider };

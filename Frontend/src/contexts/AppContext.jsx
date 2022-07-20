import { getUser } from "@/services/auth.service";
import { createContext, useEffect, useState } from "react";
import { StreamChat } from "stream-chat";

const AppContext = createContext();
const apiKey = process.env.REACT_APP_STREAM_API_KEY;
const client = StreamChat.getInstance(apiKey);

const ContextProvider = ({ children }) => {
  const [user, setUser] = useState();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const chatToken = localStorage.getItem("chatToken");
    if (userId) {
      getUser(userId)
        .then((res) => {
          const currentUser = res.data.data[0];
          if (Object.keys(currentUser).length > 0) {
            setUser(currentUser);
            client.connectUser(
              {
                id: userId,
                name: currentUser?.email,
                image: currentUser?.avatar,
              },
              chatToken
            );
          }
        })
        .catch((error) => console.log(error));
    }
  }, []);

  return (
    <AppContext.Provider value={{ user, client }}>
      {children}
    </AppContext.Provider>
  );
};

export { ContextProvider, AppContext };

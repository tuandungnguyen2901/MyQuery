import React, { useState, useContext } from "react";
import { Chat } from "stream-chat-react";
import { AppContext } from "@/contexts/AppContext";
import { ChannelListContainer, ChannelContainer } from "./components";
import { StreamChat } from "stream-chat";

import "stream-chat-react/dist/css/index.css";
import "./MessengerPage.css";

const MessengerPage = () => {
  const [createType, setCreateType] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const { client } = useContext(AppContext);

  return (
    <div className="messenger-page">
      <div className="app__wrapper">
        <Chat client={client} theme="team light">
          <ChannelListContainer
            isCreating={isCreating}
            setIsCreating={setIsCreating}
            setCreateType={setCreateType}
            setIsEditing={setIsEditing}
          />
          <ChannelContainer
            isCreating={isCreating}
            setIsCreating={setIsCreating}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            createType={createType}
          />
        </Chat>
      </div>
    </div>
  );
};

export default MessengerPage;

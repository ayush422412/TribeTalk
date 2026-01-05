import React, { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";

// redux toolkit setup done
// left sidebar ping, done 
// right content listen, 
// server change done
// channel change

const RightContent = () => {
  const activeServer = useSelector(
    (state: RootState) => state.server
  );
return (
    <h1>
        {activeServer.name}
    </h1>
)

}


export default RightContent;

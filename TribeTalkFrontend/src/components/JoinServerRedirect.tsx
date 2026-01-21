import { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useJoinServerMutation } from "../features/servers/server.api";


function JoinServerRedirect() {
  const { id } = useParams();
  const [joinServer,{isLoading,isSuccess,isError}]=useJoinServerMutation()
  useEffect(()=>{
    if(id){
      joinServer({serverId:id})
    }
    

  },[id,joinServer])
 if (isSuccess){
  return <Navigate to="/home" replace />;
 }

  // return <Navigate to="/" replace />;
}

export default JoinServerRedirect;
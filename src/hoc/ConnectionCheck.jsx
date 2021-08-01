import React, { useEffect, useState } from 'react';

const ConnectionCheck = Component => {

  const Connection = () => {

    const [isOnline, setIsOnline]  = useState(true);

    const updateNetwork = () => {
      setIsOnline(window.navigator.onLine);
    };

    useEffect(() => {
      window.addEventListener("offline", updateNetwork);
      window.addEventListener("online", updateNetwork);

      return () => {
        window.removeEventListener("offline", updateNetwork);
        window.removeEventListener("online", updateNetwork);
     };
    })

    return <Component isOnline={isOnline} /> 
  }
  return Connection;
}
export default ConnectionCheck;

import React, { useEffect } from "react";



const Trigger = (props) => {
  const { setLoading } = props;
  useEffect(() => {
    setLoading(true);
    return () => {
      setLoading(false);
    };
  }, [setLoading]);

  return <></>;
};

export default Trigger;
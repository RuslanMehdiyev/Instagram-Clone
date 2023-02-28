import { useEffect, useState } from "react";
import { api } from "../../network/api";

function Home() {
  const [data, setData] = useState(null);
  useEffect(() => {
    api.getAll("/posts").then((res) => {
      // console.log(res);
      setData(res);
    });
  }, []);
  return (
    <>
      <div>
        <h1>image</h1>
        {data && (
          <img style={{ width: "200px" }} src={data[4].image} alt="My Image" />
        )}
      </div>
    </>
  );
}

export default Home;

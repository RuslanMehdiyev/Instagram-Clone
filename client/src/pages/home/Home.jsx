import { useEffect } from "react";
import { api } from "../../network/api";

function Home() {
  useEffect(() => {
    api.getAll("/posts").then((res) => console.log(res));
  }, []);

  return <div>Home</div>;
}

export default Home;

import { useEffect, useState } from "react";
import PostCard from "../../components/cards/PostsCard";
import { api } from "../../network/api";

function Home() {
  const [data, setData] = useState(null);
  useEffect(() => {
    api.getAll("/posts").then((res) => {
      console.log(res);
      setData(res);
    });
  }, []);

  if (data) {
    data.map((item) => console.log(item));
  }

  return (
    <>
      <div>
        {data &&
          data
            .reverse()
            .map((item) => (
              <PostCard
                key={item?._id}
                imageUrl={item?.image}
                username={item?.user._id.substring(0, 5)}
                caption={item?.caption}
                likes={item?.likes.length}
              />
            ))}
      </div>
    </>
  );
}

export default Home;

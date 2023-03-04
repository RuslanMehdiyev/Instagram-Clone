import { useContext, useEffect, useState } from "react";
import PostCard from "../../components/cards/PostsCard";
import { api } from "../../network/api";
import { authContext } from "../../context/AuthContext";
import PropagateLoader from "react-spinners/PropagateLoader";

function Explore() {
  const [posts, setPosts] = useState(null);
  const { currentUser } = useContext(authContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getAll("/posts")
      .then((res) => {
        setPosts(res.filter((a) => a.user._id !== currentUser._id));
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [currentUser?._id]);

  return (
    <>
      <div>
        {loading ? (
          <PropagateLoader color="#36d7b7" />
        ) : (
          posts &&
          posts
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((post) => <PostCard key={post?._id} post={post} />)
        )}
      </div>
    </>
  );
}

export default Explore;

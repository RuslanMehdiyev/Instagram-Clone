import { useContext, useEffect, useState } from "react";
import PostCard from "../../components/cards/PostsCard";
import { api } from "../../network/api";
import { authContext } from "../../context/AuthContext";

function Explore() {
  const [posts, setPosts] = useState(null);
  const { currentUser } = useContext(authContext);
  useEffect(() => {
    api.getAll("/posts").then((res) => {
      setPosts(res.filter((a) => a.user._id !== currentUser._id));
    });
  }, [currentUser?._id]);

  return (
    <>
      <div>
        {posts &&
          posts
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((post) => <PostCard key={post?._id} post={post} />)}
      </div>
    </>
  );
}

export default Explore;

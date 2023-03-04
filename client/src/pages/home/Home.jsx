import { useContext, useEffect, useState } from "react";
import PostCard from "../../components/cards/PostsCard";
import { authContext } from "../../context/AuthContext";
import { api } from "../../network/api";
import PropagateLoader from "react-spinners/PropagateLoader";

function Home() {
  const [posts, setPosts] = useState(null);
  const { currentUser } = useContext(authContext);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api
      .getAll("/posts")
      .then((res) => {
        setPosts(res.filter((a) => currentUser.following.includes(a.user._id)));
      })
      .finally(() => setLoading(false));
  }, [currentUser?._id]);

  return (
    <div>
      {loading ? (
        <PropagateLoader color="#36d7b7" />
      ) : posts && posts.length > 0 ? (
        posts
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((post) => <PostCard key={post?._id} post={post} />)
      ) : (
        <div style={{ width: "50%", textAlign: "center", margin: "7rem auto" }}>
          <h2>
            Posts from users whom you are following will be displayed in this
            section as soon as they add new content.
          </h2>
        </div>
      )}
    </div>
  );
}

export default Home;

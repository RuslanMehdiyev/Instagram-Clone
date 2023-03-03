import { Card, CardMedia } from "@mui/material";

function ProfileCard({ post }) {
  return (
    <Card style={{ marginTop: "1rem" }}>
      <CardMedia component="img" image={post.image} alt={post.caption} />
    </Card>
  );
}

export default ProfileCard;

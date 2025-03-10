import React, { useState, useEffect, useRef } from "react";
import "./social.css";

const SocialSlide = () => {
  // Sample initial posts (enough to fill screen)
  const initialPosts = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    profilePic: "https://via.placeholder.com/50",
    username: `User ${index + 1}`,
    content: `This is a post from User ${index + 1}`,
    image: "https://via.placeholder.com/300",
    likes: Math.floor(Math.random() * 200),
  }));

  const friendSuggestions = [
    {
      id: 1,
      name: "Madhavi Sharma",
      profilePic: "https://via.placeholder.com/50",
    },
    {
      id: 2,
      name: "Dinesh Pillai",
      profilePic: "https://via.placeholder.com/50",
    },
    {
      id: 3,
      name: "Kavita Nair",
      profilePic: "https://via.placeholder.com/50",
    },
  ];

  const [posts, setPosts] = useState([...initialPosts]);
  const [loading, setLoading] = useState(false);
  const feedRef = useRef(null);
  const postCountRef = useRef(initialPosts.length); // Track number of posts

  // Function to load more posts
  const loadMorePosts = () => {
    if (loading) return;
    setLoading(true);

    setTimeout(() => {
      let newPosts = [];
      let insertFriendSuggestion = Math.floor(Math.random() * (10 - 3 + 1)) + 3; // Friend suggestion interval

      for (let i = 0; i < 5; i++) {
        const newPost = {
          id: postCountRef.current + 1,
          profilePic: "https://via.placeholder.com/50",
          username: `New User ${postCountRef.current + 1}`,
          content: `Excited to share my thoughts! 🌟`,
          image: "https://via.placeholder.com/300",
          likes: Math.floor(Math.random() * 200),
        };

        newPosts.push(newPost);
        postCountRef.current++;

        // Insert friend suggestions at dynamic intervals
        if (postCountRef.current % insertFriendSuggestion === 0) {
          newPosts.push({
            id: `friend-${postCountRef.current}-${Math.random()}`, // Ensuring unique keys
            type: "friend-suggestion",
            friends: friendSuggestions.slice(
              0,
              Math.floor(Math.random() * friendSuggestions.length) + 1
            ),
          });
          insertFriendSuggestion = Math.floor(Math.random() * (10 - 3 + 1)) + 3; // Reset interval
        }
      }

      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setLoading(false);
    }, 1500);
  };

  // Infinite Scroll Event Listener
  useEffect(() => {
    const handleScroll = () => {
      if (
        feedRef.current &&
        window.innerHeight + window.scrollY >=
          feedRef.current.offsetHeight - 100
      ) {
        loadMorePosts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="social-container" ref={feedRef}>
      {/* Posts Section */}
      <div className="feed">
        {posts.map((post) =>
          post.type === "friend-suggestion" ? (
            <div className="friend-suggestions" key={post.id}>
              <h3>New Friends</h3>
              {post.friends.map((friend) => (
                <div className="friend" key={friend.id}>
                  <img
                    src={friend.profilePic}
                    alt="Profile"
                    className="profile-pic"
                  />
                  <span className="friend-name">{friend.name}</span>
                  <button>Add Friend</button>
                </div>
              ))}
            </div>
          ) : (
            <div className="post" key={post.id}>
              <div className="post-header">
                <img
                  src={post.profilePic}
                  alt="Profile"
                  className="profile-pic"
                />
                <span className="username">{post.username}</span>
              </div>
              <p className="post-content">{post.content}</p>
              <img src={post.image} alt="Post" className="post-image" />
              <div className="likes">❤️ {post.likes} likes</div>
            </div>
          )
        )}
      </div>

      {/* Loading Indicator */}
      {loading && <div className="loading">Loading more posts...</div>}
    </div>
  );
};

export default SocialSlide;

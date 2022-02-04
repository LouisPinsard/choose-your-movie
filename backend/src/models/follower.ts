export const Follower = {
  PK: { type: String, value: "user:${username}" },
  SK: { type: String, value: "follower:${followerUsername}" },
  username: { type: String, required: true },
  followerUsername: { type: String, required: true },
} as const;

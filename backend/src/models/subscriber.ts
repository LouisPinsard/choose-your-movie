export const Subscriber = {
  PK: { type: String, value: "user:${username}" },
  SK: { type: String, value: "subscriber:${subscriberUsername}" },
  username: { type: String, required: true },
  subscriberUsername: { type: String, required: true },
} as const;

import { Entity, Table } from "dynamodb-onetable";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import Dynamo from "dynamodb-onetable/Dynamo";
import { UserMovie } from "./movie";
import { Follower } from "./follower";
import { Subscriber } from "./subscriber";

const client = new Dynamo({ client: new DynamoDBClient({}) });

const TableSchema = {
  format: "onetable:1.1.0",
  version: "0.0.1",
  indexes: {
    primary: { hash: "PK", sort: "SK" },
    "LSI-1": { sort: "LSI-1-SK", local: true },
    "LSI-2": { sort: "LSI-2-SK", local: true },
    "LSI-3": { sort: "LSI-3-SK", local: true },
    "LSI-4": { sort: "LSI-4-SK", local: true },
    "LSI-5": { sort: "LSI-5-SK", local: true },
  },
  models: {
    UserMovie,
    Follower,
    Subscriber,
  },
  params: {
    isoDates: true,
    timestamps: true,
  },
};

export type UserMovie = Entity<typeof TableSchema.models.UserMovie>;
export type Follower = Entity<typeof TableSchema.models.Follower>;
export type Subscriber = Entity<typeof TableSchema.models.Subscriber>;

export const table = new Table({
  client: client,
  name: process.env.TABLE_NAME,
  schema: TableSchema,
});

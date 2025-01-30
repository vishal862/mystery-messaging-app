import dbConnect from "@/lib/dbConnection";
import { getServerSession, User } from "next-auth";
import UserModel from "@/model/User";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  const user: User = session?.user;

  if (!session || !session?.user) {
    return Response.json(
      {
        success: false,
        message: "Not authorized",
      },
      { status: 500 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    // This aggregation pipeline is designed to efficiently fetch messages for a user
    // without retrieving all messages in a single operation, which could be inefficient
    // when there are thousands of messages in the database.

    // Steps:
    // 1. { $match: { id: userId } }:
    //    - Filters the documents in the `UserModel` collection to only include the
    //      user with the specified `userId`. This step narrows down the search scope.
    // 2. { $unwind: "$messages" }:
    //    - Breaks down the `messages` array into individual documents. Each element
    //      in the array becomes a separate document. This allows sorting and further
    //      operations to be applied at the individual message level.
    // 3. { $sort: { "messages.createdAt": -1 } }:
    //    - Sorts the individual message documents by the `createdAt` field in
    //      descending order (most recent messages appear first).
    // 4. { $group: { _id: "$id", messages: { $push: "$messages" } } }:
    //    - Regroups the messages back into a single array after sorting, grouped by the
    //      user's ID (`$id`). The `$push` operator ensures the sorted messages are added
    //      back into a new `messages` array.

    // Additional Notes:
    // - This pipeline focuses on sorting messages for a specific user while keeping
    //   memory usage efficient. By using `$unwind`, sorting, and `$group`, it avoids
    //   loading the entire messages array for the user directly into memory.
    // - If pagination is required, you can add `$skip` and `$limit` stages to retrieve
    //   only a subset of messages at a time (e.g., for implementing infinite scrolling).
    // - Ensure indexes exist on the `id` field and the `messages.createdAt` field to
    //   optimize query performance.

    const user = await UserModel.aggregate([
      { $match: { id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$id", messages: { $push: "$messages" } } },
    ]);

    if (!user || user.length == 0) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    console.log(user)
    

    return Response.json(
      {
        success: true,
        message: user[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "error while getting messages",
      },
      { status: 500 }
    );
  }
}

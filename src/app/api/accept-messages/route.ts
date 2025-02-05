import dbConnect from "@/lib/dbConnection";
import { getServerSession, User } from "next-auth";
import UserModel from "@/model/User";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
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

  const userId = user._id;

  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessages: acceptMessages,
      },
      { new: true }
    );

    if (updatedUser) {
      return Response.json(
        {
          success: true,
          message: "accept messages toggeled successfully",
          updatedUser,
        },
        { status: 200 }
      );
    }

    return Response.json(
      {
        success: false,
        message: "failed to toggle user can send messages",
      },
      { status: 500 }
    );
  } catch (error) {
    console.log("error while toggling user can send messages",error);
    return Response.json(
      {
        success: false,
        message: "error while toggling user can send messages",
      },
      { status: 500 }
    );
  }
}

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

  const userId = user._id;

  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 500 }
      );
    }
    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error while toggling user can send messages",error);
    return Response.json(
      {
        success: false,
        message: "error in getting message acceptance status",
      },
      { status: 500 }
    );
  }
}

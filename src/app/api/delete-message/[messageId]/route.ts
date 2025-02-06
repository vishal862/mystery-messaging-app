import { NextResponse } from 'next/server';
import dbConnect from "@/lib/dbConnection";
import { getServerSession } from "next-auth";
import UserModel from "@/model/User";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  const user = session?.user;

  if (!session || !user) {
    return NextResponse.json(
      {
        success: false,
        message: "Not authorized",
      },
      { status: 401 }
    );
  }

  const messageId = params.messageId;

  try {
    const updatedUser = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { message: { _id: messageId } } }
    );

    if (updatedUser.modifiedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Message not found or already deleted",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Message deleted",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Error occurred while deleting the message",
      },
      { status: 500 }
    );
  }
}
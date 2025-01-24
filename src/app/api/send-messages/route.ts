import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/User";
import { IMessage } from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  const { username, messageContent } = await request.json();

  //   if (!messageContent) {
  //     return Response.json(
  //       {
  //         success: false,
  //         message: "please enter content",
  //       },
  //       { status: 400 }
  //     );
  //   }

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "this user can't accept messages",
        },
        { status: 500 }
      );
    }

    const newMessage = {messageContent,createdAt : new Date()}

    user.message.push(newMessage as unknown as IMessage)
    user.save()
  } catch (error) {
    console.log("unexpected error occured",error);
    
    return Response.json(
      {
        success: false,
        message: "error while sending message",
      },
      { status: 500 }
    );
  }
}

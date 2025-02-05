import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/User";
import { IMessage } from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username });
    console.log(user);
    

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

    const newMessage = {content,createdAt : new Date()}

    console.log(newMessage);
    

    user.message.push(newMessage as IMessage)
    await user.save()

    return Response.json(
      { message: 'Message sent successfully', success: true },
      { status: 201 }
    );
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

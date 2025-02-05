import dbConnect from "@/lib/dbConnection";
import { getServerSession, User } from "next-auth";
import UserModel from "@/model/User";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(_req: Request, { params }: { params: { messageId: string } }) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    const _user: User = session?.user;

    if(!session || !_user){
        return Response.json({
            success : false,
            message : "Not authorized"
        },
        {status : 401})
    }

    const mesgId = params.messageId;

    try {
        const updatedUser = await UserModel.updateOne(
            {_id : _user._id},
            {$pull : {message : {_id : mesgId}}}
        )

        if(updatedUser.modifiedCount === 0){
            return Response.json({
                success : false,
                message : "Message not found or already deleted"
            },
            {status : 404})
        }

        return Response.json({
            success : true,
            message : "Message deleted"
        },
        {status : 200})
    } catch (error) {
        console.log(error);
        return Response.json({
            success : false,
            message : "error occured while deleting the user"
        },
        {status : 500})
    }
}

import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnection";
import { z } from "zod";
import { usernameVerified } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameVerified,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    console.log(searchParams);

    const queryParam = {
      username: searchParams.get("username"),
    };

    //validate with zod

    const result = UsernameQuerySchema.safeParse(queryParam);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];

      return Response.json({
        success: false,
        message:
          usernameErrors?.length > 0
            ? usernameErrors.join(", ")
            : "Invalid query parameters",
      },{status : 400});
    }

    const {username} = result.data

    const existingVerifiedUser = await UserModel.findOne({username, isVerified : true})

    if(existingVerifiedUser){
        return Response.json({
            success : false,
            message : "username is already taken"
        },{status : 400})
    }

    return Response.json(
      {
        success: true,
        message: "Username is unique",
      },
      { status: 200}
    );
  } catch (error) {
    console.error("Error while checking username", error);
    return Response.json(
      {
        success: false,
        message: "Error while checking username",
      },
      { status: 500 }
    );
  }
}

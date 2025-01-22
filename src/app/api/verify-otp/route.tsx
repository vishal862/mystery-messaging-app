import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, otp } = await request.json();

    const decodedUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "error while verifying otp",
        },
        { status: 500 }
      );
    }

    const isOtpValid = user.verifyCode === otp;
    const isOtpNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isOtpValid && isOtpNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "Account verified",
        },
        { status: 200 }
      );
    } else if (!isOtpNotExpired) {
      return Response.json(
        {
          success: false,
          message: "otp expired, please signup again to get a new code",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "incorrect otp",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("error while verifying otp");
    return Response.json(
      {
        success: false,
        message: "error while verifying ot",
      },
      { status: 500 }
    );
  }
}

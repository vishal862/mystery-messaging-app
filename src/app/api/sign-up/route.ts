import { sendEmailVerification } from "@/helpers/sendEmailVerification";
import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/User";
import bcryptjs from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();

    //1. If the user is verified then we can't allow other users to have the same username
    const verifiedExistingUserWithUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (verifiedExistingUserWithUsername) {
      return Response.json(
        {
          status: false,
          message: "username is already taken",
        },
        { status: 400 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const existingUserWithEmail = await UserModel.findOne({ email });

    if (existingUserWithEmail) {
      if (existingUserWithEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "this email already exists, please try with another email",
          },
          { status: 500 }
        );
      } else {
        const hashedPassword = bcryptjs.hashSync(password, 16);
        existingUserWithEmail.password = hashedPassword;
        existingUserWithEmail.verifyCode = otp;
        existingUserWithEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserWithEmail.save();
      }
    } else {
      const hashedPassword = bcryptjs.hashSync(password, 16);

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      await UserModel.create({
        username,
        email,
        password: hashedPassword,
        verifyCode: otp,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        message: [],
      });
    }

    //send verification email to user
    const emailResponse = await sendEmailVerification(username, email, otp);

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully, please verify your email",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: "error occured while regestering the user",
      },
      {
        status: 500,
      }
    );
  }
}

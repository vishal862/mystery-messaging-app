import {sendOtpToUser} from "../../../helpers/sendOtp"
import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/User";
import bcryptjs from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username,email,phoneNumber,password } = await request.json();

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

    const existingUserWithPhoneNumber = await UserModel.findOne({ phoneNumber });

    if (existingUserWithPhoneNumber) {
      if (existingUserWithPhoneNumber.isVerified) {
        return Response.json(
          {
            success: false,
            message: "this number already exists, please try with another number",
          },
          { status: 500 }
        );
      } else {
        const hashedPassword = bcryptjs.hashSync(password, 16);
        existingUserWithPhoneNumber.password = hashedPassword;
        existingUserWithPhoneNumber.verifyCode = otp;
        existingUserWithPhoneNumber.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserWithPhoneNumber.save();
      }
    } else {
      const hashedPassword = bcryptjs.hashSync(password, 16);

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      await UserModel.create({
        username,
        email,
        phoneNumber,
        password: hashedPassword,
        verifyCode: otp,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        message: [],
      });
    }

    //send verification email to user
    const phoneNumberResponse = await sendOtpToUser(phoneNumber, otp);

    if (!phoneNumberResponse.success) {
      return Response.json(
        {
          success: false,
          message: phoneNumberResponse.message,
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

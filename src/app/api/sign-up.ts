import dbConnect from "@/lib/dbConnection";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const {username,email,password} = await request.json()
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

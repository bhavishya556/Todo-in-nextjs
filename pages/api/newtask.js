import { checkAuth, connectDB } from "../../utils/features";
import { Task } from "../../models/task";
import { asyncError, errorHandler } from "../../middlewares/error";

const handler = asyncError(async (req, res) => {
  try {
    if (req.method !== "POST") {
      throw new Error("Only POST Method is allowed");
    }

    await connectDB();

    const { title, description } = req.body;

    if (!title || !description) {
      throw new Error("Please Enter All fields");
    }

    const user = await checkAuth(req);
    console.log("Authenticated user:", user);

    // if (!user) {
    //   throw new Error("Login Firsxt");
    // }

    await Task.create({
      title,
      description,
      user: user._id,
    });

    res.json({
      success: true,
      message: "Task Created",
    });
  } catch (error) {
    console.error("Error in creating task:", error.message);
    errorHandler(res, 400, error.message);
  }
});

export default handler;

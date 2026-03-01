import ConnectDB from "@/lib/db";
import UserModel from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import validator from "validator";

export async function POST(req: NextRequest) {
  try {
    await ConnectDB();
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }
    const isEmailValid = validator.isEmail(email);
    if (!isEmailValid) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 },
      );
    }
    const ifUserExists = await UserModel.findOne({ email });
    if (ifUserExists) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }
    const genSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, genSalt);
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error in Register Route" },
      { status: 500 },
    );
  }
}

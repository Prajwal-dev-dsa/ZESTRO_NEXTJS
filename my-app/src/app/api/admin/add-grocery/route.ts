import { auth } from "@/auth";
import { uploadOnCloudinary } from "@/lib/cloudinary";
import ConnectDB from "@/lib/db";
import groceryModel from "@/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await ConnectDB();
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const name = formData.get("name");
    const category = formData.get("category");
    const unit = formData.get("unit");
    const price = formData.get("price");
    const image = formData.get("image");

    if (!name || !category || !unit || !price || !image) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const groceryImage = (await uploadOnCloudinary(image as Blob)) as string;
    if (!groceryImage) {
      return NextResponse.json(
        { error: "Image upload failed" },
        { status: 400 }
      );
    }

    const grocery = await groceryModel.create({
      name,
      category,
      unit,
      price,
      image: groceryImage,
    });

    return NextResponse.json(grocery, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add grocery" },
      { status: 500 }
    );
  }
}

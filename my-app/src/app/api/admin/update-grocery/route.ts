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
    const groceryId = formData.get("groceryId");

    if (!groceryId) {
      return NextResponse.json(
        { error: "Grocery ID is required" },
        { status: 400 }
      );
    }
    const updateData: any = {};

    const name = formData.get("name");
    if (name) updateData.name = name;

    const category = formData.get("category");
    if (category) updateData.category = category;

    const unit = formData.get("unit");
    if (unit) updateData.unit = unit;

    const price = formData.get("price");
    if (price) updateData.price = price;

    const image = formData.get("image");

    if (image && typeof image === "object" && "arrayBuffer" in image) {
      const groceryImage = (await uploadOnCloudinary(image as Blob)) as string;
      if (groceryImage) {
        updateData.image = groceryImage;
      }
    }
    const grocery = await groceryModel.findByIdAndUpdate(
      groceryId,
      updateData,
      { new: true }
    );
    if (!grocery) {
      return NextResponse.json({ error: "Grocery not found" }, { status: 404 });
    }
    return NextResponse.json(grocery, { status: 200 });
  } catch (error) {
    console.error("Update Grocery Error:", error);
    return NextResponse.json(
      { error: `Failed to update grocery: ${error}` },
      { status: 500 }
    );
  }
}

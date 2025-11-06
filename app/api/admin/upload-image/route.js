import imagekit, { ensureImageKit } from "@/configs/imageKit";
import { getAuth } from "@clerk/nextjs/server";
import authAdmin from "@/middlewares/authAdmin";

export async function POST(request) {
  try {
    // Guard: Ensure ImageKit is configured at runtime
    try {
      ensureImageKit();
    } catch (e) {
      return Response.json({ error: "Media service not configured" }, { status: 503 });
    }

    const { userId } = getAuth(request);
    const isAdmin = await authAdmin(userId);
    if (!isAdmin) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const image = formData.get("image");
    if (!image) return Response.json({ error: "No image provided" }, { status: 400 });

    const buffer = Buffer.from(await image.arrayBuffer());

    const response = await imagekit.upload({
      file: buffer,
      fileName: `home_hero_${Date.now()}_${image.name}`,
      folder: "home/hero"
    });

    const url = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: "1600" }
      ]
    });

    return Response.json({ success: true, url });
  } catch (error) {
    console.error("Admin image upload error:", error);
    return Response.json({ error: error.message || "Failed to upload image" }, { status: 500 });
  }
}

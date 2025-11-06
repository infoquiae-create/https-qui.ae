import authSeller from "@/middlewares/authSeller";
import imagekit from "@/configs/imageKit";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const storeId = await authSeller(userId);
        if (!storeId) {
            return Response.json({ error: "Store not approved or not found" }, { status: 403 });
        }

        const formData = await request.formData();
        const image = formData.get('image');

        if (!image) {
            return Response.json({ error: "No image provided" }, { status: 400 });
        }

        // Convert file to buffer (same as product images)
        const buffer = Buffer.from(await image.arrayBuffer());
        
        // Upload to ImageKit
        const response = await imagekit.upload({
            file: buffer,
            fileName: `desc_${Date.now()}_${image.name}`,
            folder: "products/descriptions"
        });

        // Return transformed URL
        const url = imagekit.url({
            path: response.filePath,
            transformation: [
                { quality: "auto" },
                { format: "webp" },
                { width: "800" }
            ]
        });

        return Response.json({ 
            success: true, 
            url: url 
        });

    } catch (error) {
        console.error('Image upload error:', error);
        return Response.json({ 
            error: error.message || "Failed to upload image" 
        }, { status: 500 });
    }
}

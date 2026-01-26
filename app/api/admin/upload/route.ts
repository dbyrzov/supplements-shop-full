import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const primaryIndex = parseInt(formData.get("primaryIndex") as string) || 0;
    const productSlug = (formData.get("productSlug") as string) || "product";
    const baseDir = (formData.get("baseDir") as string) || "products"; // ново
    const subDirsRaw = (formData.get("subDirs") as string) || ""; // например "proteins/whey"
    const subDirs = subDirsRaw.split("/").filter(Boolean);

    const uploadedFiles: string[] = [];

    const entries = Array.from(formData.entries());
    for (const [key, value] of entries) {
      if (key !== "images") continue;
      const file = value as File;

      const fileExt = file.name.split(".").pop() || "jpg";

      // Директория
      const dir = path.join(process.cwd(), "public", "images", baseDir, ...subDirs);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      // Пореден номер
      const fileName = `${productSlug}-${uploadedFiles.length + 1}.${fileExt}`;
      const filePath = path.join(dir, fileName);

      const arrayBuffer = await file.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(arrayBuffer));

      uploadedFiles.push(`/images/${baseDir}/${subDirs.join("/")}/${fileName}`);
    }

    return NextResponse.json({
      uploaded: uploadedFiles,
      primaryIndex,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

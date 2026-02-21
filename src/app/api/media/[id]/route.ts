import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { unlink } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Yetkisiz erişim" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) {
      return NextResponse.json(
        { error: "Medya dosyası bulunamadı" },
        { status: 404 }
      );
    }

    // Delete physical file
    const filePath = path.join(process.cwd(), "public", media.url);
    if (existsSync(filePath)) {
      await unlink(filePath);
    }

    // Delete database record
    await prisma.media.delete({ where: { id } });

    return NextResponse.json({ message: "Medya dosyası başarıyla silindi" });
  } catch (error) {
    console.error("Medya dosyası silinirken hata:", error);
    return NextResponse.json(
      { error: "Medya dosyası silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

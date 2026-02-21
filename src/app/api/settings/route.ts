import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany();

    const settingsMap: Record<string, string> = {};
    settings.forEach((setting) => {
      settingsMap[setting.key] = setting.value;
    });

    return NextResponse.json(settingsMap);
  } catch (error) {
    console.error("Ayarlar getirilirken hata:", error);
    return NextResponse.json(
      { error: "Ayarlar yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Yetkisiz erişim" },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Geçersiz veri formatı. Anahtar-değer çiftleri gönderin." },
        { status: 400 }
      );
    }

    const entries = Object.entries(body) as [string, string][];

    if (entries.length === 0) {
      return NextResponse.json(
        { error: "En az bir ayar gönderilmelidir" },
        { status: 400 }
      );
    }

    const upsertOperations = entries.map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    );

    await prisma.$transaction(upsertOperations);

    const updatedSettings = await prisma.siteSetting.findMany();
    const settingsMap: Record<string, string> = {};
    updatedSettings.forEach((setting) => {
      settingsMap[setting.key] = setting.value;
    });

    return NextResponse.json(settingsMap);
  } catch (error) {
    console.error("Ayarlar güncellenirken hata:", error);
    return NextResponse.json(
      { error: "Ayarlar güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

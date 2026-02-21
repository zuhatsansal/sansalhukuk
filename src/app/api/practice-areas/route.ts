import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { practiceAreaSchema } from "@/lib/validations";

export async function GET() {
  try {
    const practiceAreas = await prisma.practiceArea.findMany({
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json(practiceAreas);
  } catch (error) {
    console.error("Faaliyet alanları listelenirken hata:", error);
    return NextResponse.json(
      { error: "Faaliyet alanları yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Yetkisiz erişim" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = practiceAreaSchema.parse(body);

    const existing = await prisma.practiceArea.findUnique({
      where: { slug: validated.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Bu slug zaten kullanılıyor" },
        { status: 409 }
      );
    }

    const practiceArea = await prisma.practiceArea.create({
      data: validated,
    });

    return NextResponse.json(practiceArea, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Geçersiz faaliyet alanı verisi" },
        { status: 400 }
      );
    }
    console.error("Faaliyet alanı oluşturulurken hata:", error);
    return NextResponse.json(
      { error: "Faaliyet alanı oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}

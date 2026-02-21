import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { practiceAreaSchema } from "@/lib/validations";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const practiceArea = await prisma.practiceArea.findUnique({
      where: { id },
    });

    if (!practiceArea) {
      return NextResponse.json(
        { error: "Faaliyet alanı bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(practiceArea);
  } catch (error) {
    console.error("Faaliyet alanı getirilirken hata:", error);
    return NextResponse.json(
      { error: "Faaliyet alanı yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Yetkisiz erişim" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existing = await prisma.practiceArea.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Faaliyet alanı bulunamadı" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validated = practiceAreaSchema.parse(body);

    const slugConflict = await prisma.practiceArea.findFirst({
      where: { slug: validated.slug, NOT: { id } },
    });

    if (slugConflict) {
      return NextResponse.json(
        { error: "Bu slug zaten başka bir faaliyet alanı tarafından kullanılıyor" },
        { status: 409 }
      );
    }

    const practiceArea = await prisma.practiceArea.update({
      where: { id },
      data: validated,
    });

    return NextResponse.json(practiceArea);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Geçersiz faaliyet alanı verisi" },
        { status: 400 }
      );
    }
    console.error("Faaliyet alanı güncellenirken hata:", error);
    return NextResponse.json(
      { error: "Faaliyet alanı güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
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

    const existing = await prisma.practiceArea.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Faaliyet alanı bulunamadı" },
        { status: 404 }
      );
    }

    await prisma.practiceArea.delete({ where: { id } });

    return NextResponse.json({ message: "Faaliyet alanı başarıyla silindi" });
  } catch (error) {
    console.error("Faaliyet alanı silinirken hata:", error);
    return NextResponse.json(
      { error: "Faaliyet alanı silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

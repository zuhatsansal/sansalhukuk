import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { faqSchema } from "@/lib/validations";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const faq = await prisma.fAQ.findUnique({
      where: { id },
    });

    if (!faq) {
      return NextResponse.json(
        { error: "SSS bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(faq);
  } catch (error) {
    console.error("SSS getirilirken hata:", error);
    return NextResponse.json(
      { error: "SSS yüklenirken bir hata oluştu" },
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

    const existing = await prisma.fAQ.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "SSS bulunamadı" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validated = faqSchema.parse(body);

    const faq = await prisma.fAQ.update({
      where: { id },
      data: validated,
    });

    return NextResponse.json(faq);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Geçersiz SSS verisi" },
        { status: 400 }
      );
    }
    console.error("SSS güncellenirken hata:", error);
    return NextResponse.json(
      { error: "SSS güncellenirken bir hata oluştu" },
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

    const existing = await prisma.fAQ.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "SSS bulunamadı" },
        { status: 404 }
      );
    }

    await prisma.fAQ.delete({ where: { id } });

    return NextResponse.json({ message: "SSS başarıyla silindi" });
  } catch (error) {
    console.error("SSS silinirken hata:", error);
    return NextResponse.json(
      { error: "SSS silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

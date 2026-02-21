import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { articleSchema } from "@/lib/validations";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const article = await prisma.article.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!article) {
      return NextResponse.json(
        { error: "Makale bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Makale getirilirken hata:", error);
    return NextResponse.json(
      { error: "Makale yüklenirken bir hata oluştu" },
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

    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Makale bulunamadı" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validated = articleSchema.parse(body);

    const slugConflict = await prisma.article.findFirst({
      where: { slug: validated.slug, NOT: { id } },
    });

    if (slugConflict) {
      return NextResponse.json(
        { error: "Bu slug zaten başka bir makale tarafından kullanılıyor" },
        { status: 409 }
      );
    }

    const publishedAt =
      validated.published && !existing.published
        ? new Date()
        : validated.published
          ? existing.publishedAt
          : null;

    const article = await prisma.article.update({
      where: { id },
      data: {
        ...validated,
        publishedAt,
      },
      include: { category: true },
    });

    return NextResponse.json(article);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Geçersiz makale verisi" },
        { status: 400 }
      );
    }
    console.error("Makale güncellenirken hata:", error);
    return NextResponse.json(
      { error: "Makale güncellenirken bir hata oluştu" },
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

    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Makale bulunamadı" },
        { status: 404 }
      );
    }

    await prisma.article.delete({ where: { id } });

    return NextResponse.json({ message: "Makale başarıyla silindi" });
  } catch (error) {
    console.error("Makale silinirken hata:", error);
    return NextResponse.json(
      { error: "Makale silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

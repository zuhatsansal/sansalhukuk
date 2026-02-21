import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { testimonialSchema } from "@/lib/validations";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!testimonial) {
      return NextResponse.json(
        { error: "Referans bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error("Referans getirilirken hata:", error);
    return NextResponse.json(
      { error: "Referans yüklenirken bir hata oluştu" },
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

    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Referans bulunamadı" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validated = testimonialSchema.parse(body);

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: validated,
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Geçersiz referans verisi" },
        { status: 400 }
      );
    }
    console.error("Referans güncellenirken hata:", error);
    return NextResponse.json(
      { error: "Referans güncellenirken bir hata oluştu" },
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

    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Referans bulunamadı" },
        { status: 404 }
      );
    }

    await prisma.testimonial.delete({ where: { id } });

    return NextResponse.json({ message: "Referans başarıyla silindi" });
  } catch (error) {
    console.error("Referans silinirken hata:", error);
    return NextResponse.json(
      { error: "Referans silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

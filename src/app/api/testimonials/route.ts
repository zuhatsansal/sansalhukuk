import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { testimonialSchema } from "@/lib/validations";

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Referanslar listelenirken hata:", error);
    return NextResponse.json(
      { error: "Referanslar yüklenirken bir hata oluştu" },
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
    const validated = testimonialSchema.parse(body);

    const testimonial = await prisma.testimonial.create({
      data: validated,
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Geçersiz referans verisi" },
        { status: 400 }
      );
    }
    console.error("Referans oluşturulurken hata:", error);
    return NextResponse.json(
      { error: "Referans oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}

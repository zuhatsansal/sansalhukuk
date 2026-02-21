import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { faqSchema } from "@/lib/validations";

export async function GET() {
  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json(faqs);
  } catch (error) {
    console.error("SSS listelenirken hata:", error);
    return NextResponse.json(
      { error: "SSS yüklenirken bir hata oluştu" },
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
    const validated = faqSchema.parse(body);

    const faq = await prisma.fAQ.create({
      data: validated,
    });

    return NextResponse.json(faq, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Geçersiz SSS verisi" },
        { status: 400 }
      );
    }
    console.error("SSS oluşturulurken hata:", error);
    return NextResponse.json(
      { error: "SSS oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}

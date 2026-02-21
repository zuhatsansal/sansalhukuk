import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Yetkisiz erişim" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const submission = await prisma.contactSubmission.findUnique({
      where: { id },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "İletişim formu bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(submission);
  } catch (error) {
    console.error("İletişim formu getirilirken hata:", error);
    return NextResponse.json(
      { error: "İletişim formu yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Yetkisiz erişim" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existing = await prisma.contactSubmission.findUnique({
      where: { id },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "İletişim formu bulunamadı" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { read } = body;

    if (typeof read !== "boolean") {
      return NextResponse.json(
        { error: "Geçersiz veri: 'read' alanı boolean olmalıdır" },
        { status: 400 }
      );
    }

    const submission = await prisma.contactSubmission.update({
      where: { id },
      data: { read },
    });

    return NextResponse.json(submission);
  } catch (error) {
    console.error("İletişim formu güncellenirken hata:", error);
    return NextResponse.json(
      { error: "İletişim formu güncellenirken bir hata oluştu" },
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

    const existing = await prisma.contactSubmission.findUnique({
      where: { id },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "İletişim formu bulunamadı" },
        { status: 404 }
      );
    }

    await prisma.contactSubmission.delete({ where: { id } });

    return NextResponse.json({ message: "İletişim formu başarıyla silindi" });
  } catch (error) {
    console.error("İletişim formu silinirken hata:", error);
    return NextResponse.json(
      { error: "İletişim formu silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

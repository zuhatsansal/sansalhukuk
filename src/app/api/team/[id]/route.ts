import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { teamMemberSchema } from "@/lib/validations";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const member = await prisma.teamMember.findUnique({
      where: { id },
    });

    if (!member) {
      return NextResponse.json(
        { error: "Ekip üyesi bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error("Ekip üyesi getirilirken hata:", error);
    return NextResponse.json(
      { error: "Ekip üyesi yüklenirken bir hata oluştu" },
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

    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Ekip üyesi bulunamadı" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validated = teamMemberSchema.parse(body);

    const member = await prisma.teamMember.update({
      where: { id },
      data: validated,
    });

    return NextResponse.json(member);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Geçersiz ekip üyesi verisi" },
        { status: 400 }
      );
    }
    console.error("Ekip üyesi güncellenirken hata:", error);
    return NextResponse.json(
      { error: "Ekip üyesi güncellenirken bir hata oluştu" },
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

    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Ekip üyesi bulunamadı" },
        { status: 404 }
      );
    }

    await prisma.teamMember.delete({ where: { id } });

    return NextResponse.json({ message: "Ekip üyesi başarıyla silindi" });
  } catch (error) {
    console.error("Ekip üyesi silinirken hata:", error);
    return NextResponse.json(
      { error: "Ekip üyesi silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

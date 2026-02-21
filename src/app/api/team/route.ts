import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { teamMemberSchema } from "@/lib/validations";

export async function GET() {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error("Ekip üyeleri listelenirken hata:", error);
    return NextResponse.json(
      { error: "Ekip üyeleri yüklenirken bir hata oluştu" },
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
    const validated = teamMemberSchema.parse(body);

    const member = await prisma.teamMember.create({
      data: validated,
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Geçersiz ekip üyesi verisi" },
        { status: 400 }
      );
    }
    console.error("Ekip üyesi oluşturulurken hata:", error);
    return NextResponse.json(
      { error: "Ekip üyesi oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}

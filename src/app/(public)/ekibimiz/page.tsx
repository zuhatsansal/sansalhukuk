import prisma from "@/lib/prisma";
import { getInitials } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ekibimiz",
  description: "Şansal Hukuk Bürosu avukat kadrosu. Alanında uzman ekibimizle tanışın.",
};

export default async function TeamPage() {
  let members: { id: string; name: string; title: string; photo: string | null; bio: string | null }[] = [];
  try {
    members = await prisma.teamMember.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, title: true, photo: true, bio: true },
    });
  } catch {
    // DB not available
  }

  return (
    <>
      <section className="bg-primary py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-gold text-sm font-semibold uppercase tracking-[3px]">Şansal Hukuk Bürosu</span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mt-3">Ekibimiz</h1>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member) => (
              <div key={member.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-light hover:shadow-lg transition-shadow">
                <div className="aspect-[3/4] bg-gray-light flex items-center justify-center">
                  {member.photo ? (
                    <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-24 h-24 bg-gold/20 rounded-full flex items-center justify-center">
                      <span className="text-gold text-3xl font-heading font-bold">{getInitials(member.name)}</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-xl font-bold text-primary">{member.name}</h3>
                  <p className="text-gold text-sm mt-1 mb-3">{member.title}</p>
                  {member.bio && (
                    <p className="text-gray-dark/60 text-sm leading-relaxed">{member.bio}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Admin User
  const hashedPassword = await bcrypt.hash("Admin123!", 12);
  await prisma.user.upsert({
    where: { email: "admin@sansalhukuk.com" },
    update: {},
    create: {
      email: "admin@sansalhukuk.com",
      password: hashedPassword,
      name: "Admin",
      role: "admin",
    },
  });
  console.log("Admin user created");

  // Categories
  const categories = [
    { name: "Aile Hukuku", slug: "aile-hukuku" },
    { name: "Ceza Hukuku", slug: "ceza-hukuku" },
    { name: "Miras Hukuku", slug: "miras-hukuku" },
    { name: "Gayrimenkul Hukuku", slug: "gayrimenkul-hukuku" },
    { name: "İdare Hukuku", slug: "idare-hukuku" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("Categories created");

  // Practice Areas
  const practiceAreas = [
    {
      title: "Aile ve Boşanma Hukuku",
      slug: "aile-ve-bosanma-hukuku",
      icon: "Heart",
      shortDesc:
        "Boşanma davaları, nafaka, velayet, mal paylaşımı ve aile içi uyuşmazlıkların çözümünde profesyonel hukuki destek sunuyoruz.",
      content: `<h2>Aile ve Boşanma Hukuku</h2>
<p>Aile hukuku, bireylerin en özel ve hassas meselelerini kapsayan bir hukuk dalıdır. Büromuz, aile hukukunun tüm alanlarında müvekkillerine kapsamlı hukuki destek sağlamaktadır.</p>
<h3>Hizmetlerimiz</h3>
<ul>
<li>Anlaşmalı ve çekişmeli boşanma davaları</li>
<li>Nafaka davaları (tedbir, iştirak, yoksulluk nafakası)</li>
<li>Velayet ve kişisel ilişki düzenlenmesi</li>
<li>Mal rejimi tasfiyesi</li>
<li>Evlat edinme işlemleri</li>
<li>Aile içi şiddet ve koruma kararları</li>
</ul>
<p>Her aile farklıdır ve her davanın kendine özgü koşulları vardır. Biz, müvekkillerimizin haklarını en iyi şekilde korumak için kişiye özel çözümler üretiyoruz.</p>`,
      sortOrder: 1,
    },
    {
      title: "Ceza ve Ağır Ceza Hukuku",
      slug: "ceza-ve-agir-ceza-hukuku",
      icon: "Shield",
      shortDesc:
        "Ceza davalarında savunma, müdafi hizmetleri ve ceza hukuku alanında uzman avukatlık desteği sağlıyoruz.",
      content: `<h2>Ceza ve Ağır Ceza Hukuku</h2>
<p>Ceza hukuku alanında, müvekkillerimizin haklarını en üst düzeyde korumak temel önceliğimizdir. Soruşturma aşamasından kesinleşmiş mahkumiyet kararlarına kadar her aşamada yanınızdayız.</p>
<h3>Hizmetlerimiz</h3>
<ul>
<li>Soruşturma aşamasında hukuki danışmanlık</li>
<li>Ağır ceza mahkemelerinde savunma</li>
<li>Tutukluluk ve tahliye talepleri</li>
<li>İstinaf ve temyiz başvuruları</li>
<li>Ceza indirimi ve erteleme talepleri</li>
</ul>`,
      sortOrder: 2,
    },
    {
      title: "Miras Hukuku",
      slug: "miras-hukuku",
      icon: "FileText",
      shortDesc:
        "Miras paylaşımı, vasiyetname düzenlenmesi, terekenin tespiti ve mirasçılık belgesi işlemlerinde hukuki danışmanlık.",
      content: `<h2>Miras Hukuku</h2>
<p>Miras hukuku, bir kişinin vefatı sonrasında mal varlığının nasıl paylaşılacağını düzenleyen önemli bir hukuk dalıdır.</p>
<h3>Hizmetlerimiz</h3>
<ul>
<li>Mirasçılık belgesi alınması</li>
<li>Terekenin tespiti ve paylaşımı</li>
<li>Vasiyetname düzenlenmesi</li>
<li>Miras sözleşmeleri</li>
<li>Tenkis ve denkleştirme davaları</li>
<li>Mirastan feragat işlemleri</li>
</ul>`,
      sortOrder: 3,
    },
    {
      title: "Kira Hukuku",
      slug: "kira-hukuku",
      icon: "Home",
      shortDesc:
        "Kira sözleşmeleri, tahliye davaları, kira uyarlaması ve kiracı-kiraya veren uyuşmazlıklarının çözümü.",
      content: `<h2>Kira Hukuku</h2>
<p>Kira hukuku, kiracı ve kiraya veren arasındaki ilişkileri düzenleyen ve günlük hayatımızda sıkça karşılaşılan bir hukuk alanıdır.</p>
<h3>Hizmetlerimiz</h3>
<ul>
<li>Kira sözleşmesi hazırlanması</li>
<li>Tahliye davaları</li>
<li>Kira bedelinin tespiti ve uyarlanması</li>
<li>Kira alacağı davaları</li>
<li>Depozito iade uyuşmazlıkları</li>
</ul>`,
      sortOrder: 4,
    },
    {
      title: "Gayrimenkul Hukuku",
      slug: "gayrimenkul-hukuku",
      icon: "Building",
      shortDesc:
        "Tapu işlemleri, imar hukuku, kat mülkiyeti, kamulaştırma ve gayrimenkul alım-satım işlemlerinde hukuki destek.",
      content: `<h2>Gayrimenkul Hukuku</h2>
<p>Gayrimenkul hukuku, taşınmaz mallara ilişkin tüm hukuki süreçleri kapsayan geniş bir alandır.</p>
<h3>Hizmetlerimiz</h3>
<ul>
<li>Gayrimenkul alım-satım işlemleri</li>
<li>Tapu iptal ve tescil davaları</li>
<li>Kat mülkiyeti uyuşmazlıkları</li>
<li>Kamulaştırma davaları</li>
<li>İmar hukuku danışmanlığı</li>
<li>Kentsel dönüşüm süreçleri</li>
</ul>`,
      sortOrder: 5,
    },
    {
      title: "İdare Hukuku",
      slug: "idare-hukuku",
      icon: "Landmark",
      shortDesc:
        "İdari işlem ve eylemlere karşı iptal davaları, tam yargı davaları ve idari başvuru süreçlerinde danışmanlık.",
      content: `<h2>İdare Hukuku</h2>
<p>İdare hukuku, devlet ile bireyler arasındaki ilişkileri düzenleyen ve vatandaşların haklarını koruyan temel bir hukuk dalıdır.</p>
<h3>Hizmetlerimiz</h3>
<ul>
<li>İptal davaları</li>
<li>Tam yargı davaları</li>
<li>İdari para cezalarına itiraz</li>
<li>Kamu ihale hukuku</li>
<li>Disiplin soruşturmaları</li>
<li>İdari başvuru süreçleri</li>
</ul>`,
      sortOrder: 6,
    },
  ];

  for (const area of practiceAreas) {
    await prisma.practiceArea.upsert({
      where: { slug: area.slug },
      update: {},
      create: area,
    });
  }
  console.log("Practice areas created");

  // Team Member
  await prisma.teamMember.upsert({
    where: { id: "team-zuhat" },
    update: {},
    create: {
      id: "team-zuhat",
      name: "Av. Mehmet Zuhat Şansal",
      title: "Kurucu Avukat",
      bio: "İstanbul Üniversitesi Hukuk Fakültesi mezunu olan Av. Mehmet Zuhat Şansal, meslek hayatına başladığı günden bu yana pek çok farklı hukuk alanında müvekkillerine başarılı hukuki hizmet sunmaktadır. Özellikle aile hukuku, ceza hukuku ve gayrimenkul hukuku alanlarında uzmanlaşmış olan Şansal, müvekkillerinin haklarını en etkin şekilde korumayı ilke edinmiştir.",
      sortOrder: 1,
    },
  });
  console.log("Team member created");

  // Sample Articles
  const aileCategory = await prisma.category.findUnique({
    where: { slug: "aile-hukuku" },
  });

  const cezaCategory = await prisma.category.findUnique({
    where: { slug: "ceza-hukuku" },
  });

  const mirasCategory = await prisma.category.findUnique({
    where: { slug: "miras-hukuku" },
  });

  const articles = [
    {
      title: "Anlaşmalı Boşanma Süreci ve Şartları",
      slug: "anlasmalı-bosanma-sureci-ve-sartlari",
      excerpt:
        "Anlaşmalı boşanma, eşlerin karşılıklı anlaşarak evlilik birliğini sona erdirmesidir. Bu yazıda anlaşmalı boşanmanın şartlarını ve sürecini ele alıyoruz.",
      content: `<h2>Anlaşmalı Boşanma Nedir?</h2>
<p>Anlaşmalı boşanma, evlilik birliğinin en az bir yıl sürmüş olması koşuluyla, eşlerin boşanma ve boşanmanın sonuçları hakkında anlaşarak mahkemeye başvurmasıdır.</p>
<h3>Anlaşmalı Boşanmanın Şartları</h3>
<p>Türk Medeni Kanunu'nun 166/3. maddesi uyarınca anlaşmalı boşanma için şu koşulların sağlanması gerekir:</p>
<ul>
<li>Evliliğin en az 1 yıl sürmüş olması</li>
<li>Eşlerin birlikte başvurması veya bir eşin başvurusunu diğerinin kabul etmesi</li>
<li>Hakimin tarafları bizzat dinlemesi</li>
<li>Boşanmanın mali sonuçları ve çocuklarla ilgili konularda anlaşma sağlanması</li>
</ul>
<h3>Anlaşmalı Boşanma Protokolü</h3>
<p>Anlaşmalı boşanma davası açabilmek için eşlerin bir protokol hazırlaması gerekmektedir. Bu protokolde nafaka, mal paylaşımı, velayet ve kişisel ilişki gibi konular düzenlenmelidir.</p>`,
      categoryId: aileCategory?.id,
      published: true,
      publishedAt: new Date("2024-12-15"),
    },
    {
      title: "Ceza Davalarında Savunma Hakkı",
      slug: "ceza-davalarinda-savunma-hakki",
      excerpt:
        "Ceza davalarında savunma hakkı, hukuk devletinin temel taşlarından biridir. Bu makalede savunma hakkının kapsamını inceliyoruz.",
      content: `<h2>Savunma Hakkının Önemi</h2>
<p>Savunma hakkı, Anayasa ve uluslararası sözleşmelerle güvence altına alınmış temel bir insan hakkıdır. Ceza yargılamasının her aşamasında şüpheli ve sanığın savunma hakkı bulunmaktadır.</p>
<h3>Savunma Hakkının Kapsamı</h3>
<ul>
<li>Müdafi yardımından yararlanma hakkı</li>
<li>Susma hakkı</li>
<li>Delillere erişim hakkı</li>
<li>Tanıklara soru sorma hakkı</li>
<li>Tercüman talep etme hakkı</li>
</ul>
<p>Savunma hakkının etkin bir şekilde kullanılabilmesi için uzman bir ceza avukatından destek almak son derece önemlidir.</p>`,
      categoryId: cezaCategory?.id,
      published: true,
      publishedAt: new Date("2025-01-10"),
    },
    {
      title: "Miras Hukukunda Saklı Pay ve Tenkis Davası",
      slug: "miras-hukukunda-sakli-pay-ve-tenkis-davasi",
      excerpt:
        "Miras hukukunda saklı pay, yasal mirasçıların belirli bir bölümünün korunmasını sağlayan önemli bir kavramdır.",
      content: `<h2>Saklı Pay Nedir?</h2>
<p>Saklı pay, miras bırakanın tasarruf özgürlüğünü sınırlayan ve belirli yasal mirasçıların miras paylarının bir kısmını güvence altına alan hukuki bir kavramdır.</p>
<h3>Saklı Paylı Mirasçılar</h3>
<ul>
<li>Altsoy (çocuklar, torunlar)</li>
<li>Anne ve baba</li>
<li>Sağ kalan eş</li>
</ul>
<h3>Tenkis Davası</h3>
<p>Saklı payın ihlal edilmesi durumunda, saklı paylı mirasçılar tenkis davası açarak haklarını koruyabilirler. Tenkis davası, miras bırakanın ölümünden itibaren belirli süreler içinde açılmalıdır.</p>`,
      categoryId: mirasCategory?.id,
      published: true,
      publishedAt: new Date("2025-02-05"),
    },
  ];

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: article,
    });
  }
  console.log("Articles created");

  // FAQs
  const faqs = [
    {
      question: "Avukata ne zaman başvurmalıyım?",
      answer:
        "Hukuki bir sorunla karşılaştığınızda veya herhangi bir hukuki işlem yapmadan önce bir avukata danışmanız önerilir. Erken aşamada alınan hukuki destek, ileride oluşabilecek sorunları önlemeye yardımcı olur.",
      sortOrder: 1,
    },
    {
      question: "İlk görüşme ücretsiz mi?",
      answer:
        "İlk görüşmemizde davanız hakkında genel bir değerlendirme yapılır. Görüşme koşulları ve ücretlendirme hakkında detaylı bilgi almak için bize ulaşabilirsiniz.",
      sortOrder: 2,
    },
    {
      question: "Dava süreci ne kadar sürer?",
      answer:
        "Dava süreci, davanın türüne, mahkemenin iş yüküne ve davanın karmaşıklığına göre değişiklik gösterir. Basit davalar birkaç ayda sonuçlanabilirken, karmaşık davalar yıllar sürebilir. Her dava için tahmini süre hakkında size bilgi veririz.",
      sortOrder: 3,
    },
    {
      question: "Avukatlık ücreti nasıl belirlenir?",
      answer:
        "Avukatlık ücreti, davanın türüne, karmaşıklığına ve süresine göre belirlenir. Türkiye Barolar Birliği tarafından yayınlanan Avukatlık Asgari Ücret Tarifesi esas alınmakla birlikte, her dava için ayrı ücret belirlenmektedir.",
      sortOrder: 4,
    },
    {
      question: "Online danışmanlık hizmeti veriyor musunuz?",
      answer:
        "Evet, müvekkillerimize online görüşme imkanı sunmaktayız. Telefon veya video konferans yoluyla hukuki danışmanlık hizmeti alabilirsiniz. Randevu oluşturmak için iletişim sayfamızdan bize ulaşabilirsiniz.",
      sortOrder: 5,
    },
  ];

  for (const faq of faqs) {
    const existing = await prisma.fAQ.findFirst({
      where: { question: faq.question },
    });
    if (!existing) {
      await prisma.fAQ.create({ data: faq });
    }
  }
  console.log("FAQs created");

  // Testimonials
  const testimonials = [
    {
      name: "A. Yılmaz",
      rating: 5,
      content:
        "Boşanma davamda beni temsil eden Av. Mehmet Zuhat Şansal'a çok teşekkür ederim. Profesyonel yaklaşımı ve ilgisi sayesinde davamız başarıyla sonuçlandı. Kendisini gönül rahatlığıyla tavsiye ederim.",
      approved: true,
    },
    {
      name: "M. Kaya",
      rating: 5,
      content:
        "Gayrimenkul alım satım işlemlerimde büyük destek sağladılar. Her aşamada bilgilendirildim ve haklarımın korunduğunu hissettim. Teşekkürler Şansal Hukuk Bürosu.",
      approved: true,
    },
    {
      name: "S. Demir",
      rating: 5,
      content:
        "Miras davamda Av. Şansal'ın uzmanlığı ve deneyimi sayesinde haklarımı tam olarak aldım. Çok profesyonel ve güvenilir bir hukuk bürosu. Herkese tavsiye ederim.",
      approved: true,
    },
  ];

  for (const t of testimonials) {
    const existing = await prisma.testimonial.findFirst({
      where: { name: t.name },
    });
    if (!existing) {
      await prisma.testimonial.create({ data: t });
    }
  }
  console.log("Testimonials created");

  // Site Settings
  const settings = [
    { key: "site_title", value: "Şansal Hukuk Bürosu" },
    {
      key: "site_description",
      value:
        "Av. Mehmet Zuhat Şansal - Profesyonel Hukuki Danışmanlık",
    },
    { key: "phone", value: "+90 XXX XXX XX XX" },
    { key: "email", value: "info@sansalhukuk.com" },
    { key: "address", value: "İstanbul, Türkiye" },
    { key: "whatsapp", value: "+90XXXXXXXXXX" },
    { key: "hero_title", value: "Tecrübe, Güven, Çözüm" },
    { key: "hero_subtitle", value: "Av. Mehmet Zuhat Şansal" },
    {
      key: "hero_description",
      value:
        "Hukuki sorunlarınızda yanınızdayız. Profesyonel ve güvenilir hukuki danışmanlık hizmeti için bize ulaşın.",
    },
    {
      key: "about_text",
      value:
        "Av. Mehmet Zuhat Şansal tarafından kurulan hukuk büromuz, müvekkillerine kaliteli, güvenilir ve şeffaf hukuki danışmanlık hizmeti sunmaktadır. Geniş bir hukuki yelpazede uzmanlaşmış kadromuzla, her müvekkilimize özel çözümler üretiyoruz.",
    },
    { key: "stat_1_value", value: "500+" },
    { key: "stat_1_label", value: "Çözülen Dava" },
    { key: "stat_2_value", value: "4" },
    { key: "stat_2_label", value: "Alanında Uzman Avukat" },
    { key: "stat_3_value", value: "800+" },
    { key: "stat_3_label", value: "Mutlu Müvekkil" },
    { key: "process_1_title", value: "İlk Görüşme" },
    {
      key: "process_1_desc",
      value:
        "Hukuki sorununuzu dinliyor, durumu değerlendiriyor ve size en uygun çözüm yolunu belirliyoruz.",
    },
    { key: "process_2_title", value: "Dava Değerlendirme" },
    {
      key: "process_2_desc",
      value:
        "Davanızı detaylı olarak analiz ediyor, başarı şansını değerlendiriyor ve strateji oluşturuyoruz.",
    },
    { key: "process_3_title", value: "Hukuki Strateji" },
    {
      key: "process_3_desc",
      value:
        "Size özel hazırlanan hukuki strateji ile haklarınızı en etkin şekilde koruyoruz.",
    },
    { key: "instagram", value: "" },
    { key: "linkedin", value: "" },
    { key: "twitter", value: "" },
    { key: "facebook", value: "" },
    {
      key: "footer_text",
      value:
        "Şansal Hukuk Bürosu, müvekkillerine en yüksek kalitede hukuki hizmet sunmayı ilke edinmiştir.",
    },
    { key: "working_hours", value: "Pazartesi - Cuma: 09:00 - 18:00" },
    {
      key: "maps_embed",
      value:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d385398.5897841911!2d28.731994699999998!3d41.0054958!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa7040068086b%3A0xe1ccfe98bc01b0d0!2zxLBzdGFuYnVs!5e0!3m2!1str!2str!4v1234567890",
    },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log("Site settings created");

  console.log("Seeding completed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });

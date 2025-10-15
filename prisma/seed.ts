import { PrismaClient, UserRole, ProductStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("🚀 Démarrage du seed...");

    // Hash unique du mot de passe
    const passwordHash = await bcrypt.hash("admin123", 10);

    // === 1️⃣ Super admin ===
    const superAdmin = await prisma.user.upsert({
      where: { email: "jeeridev@gmail.com" },
      update: {
        name: "Jeeri Dev Super Admin",
        password: passwordHash,
        telephone: "+221781234567",
        adresse: "Plateau, Dakar, Sénégal",
        role: UserRole.SUPER_ADMIN,
      },
      create: {
        name: "Jeeri Dev Super Admin",
        email: "jeeridev@gmail.com",
        password: passwordHash,
        telephone: "+221781234567",
        adresse: "Plateau, Dakar, Sénégal",
        role: UserRole.SUPER_ADMIN,
      },
    });

    console.log(`✅ Super admin créé: ${superAdmin.email}`);

    // === 2️⃣ Vendeurs ===
    const vendeursData = [
      {
        name: "Amadou DIALLO",
        email: "amadou.diallo@ecommerce.sn",
        telephone: "+221771234567",
        adresse: "Medina, Dakar, Sénégal",
      },
      {
        name: "Fatou NDIAYE",
        email: "fatou.ndiaye@ecommerce.sn",
        telephone: "+221772345678",
        adresse: "Parcelles Assainies, Dakar, Sénégal",
      },
      {
        name: "Ibrahima BA",
        email: "ibrahima.ba@ecommerce.sn",
        telephone: "+221773456789",
        adresse: "Grand Yoff, Dakar, Sénégal",
      },
      {
        name: "Awa SARR",
        email: "awa.sarr@ecommerce.sn",
        telephone: "+221774567890",
        adresse: "Keur Massar, Dakar, Sénégal",
      },
      {
        name: "Ousmane SY",
        email: "ousmane.sy@ecommerce.sn",
        telephone: "+221775678901",
        adresse: "Rufisque, Dakar, Sénégal",
      },
    ];

    const vendeurs = await Promise.all(
      vendeursData.map((v) =>
        prisma.user.upsert({
          where: { email: v.email },
          update: {
            name: v.name,
            password: passwordHash,
            telephone: v.telephone,
            adresse: v.adresse,
            role: UserRole.VENDEUR,
          },
          create: {
            ...v,
            password: passwordHash,
            role: UserRole.VENDEUR,
          },
        })
      )
    );

    console.log(`✅ ${vendeurs.length} vendeurs créés`);

    // === 3️⃣ Catégories ===
    const categoriesData = [
      { libelle: "Électronique", description: "Appareils électroniques et accessoires" },
      { libelle: "Vêtements", description: "Mode et vêtements pour tous" },
      { libelle: "Maison & Jardin", description: "Articles pour la maison et le jardin" },
      { libelle: "Sport & Loisirs", description: "Équipements sportifs et loisirs" },
      { libelle: "Livres & Médias", description: "Livres, films et médias divers" },
    ];

    const categories = await Promise.all(
      categoriesData.map((cat) =>
        prisma.category.upsert({
          where: { libelle: cat.libelle },
          update: { description: cat.description },
          create: cat,
        })
      )
    );

    console.log(`✅ ${categories.length} catégories créées`);

    // === 4️⃣ Produits ===
    const existingProductsCount = await prisma.product.count();
    if (existingProductsCount === 0) {
      const produitsExemples = [
        { title: "iPhone 14 Pro", description: "Smartphone Apple dernière génération", price: 899000, category: 0 },
        { title: "Samsung Galaxy S23", description: "Smartphone Samsung haut de gamme", price: 750000, category: 0 },
        { title: "MacBook Air M2", description: "Ordinateur portable Apple", price: 1200000, category: 0 },
        { title: "AirPods Pro", description: "Écouteurs sans fil Apple", price: 180000, category: 0 },
        { title: "T-shirt Coton Bio", description: "T-shirt en coton biologique", price: 15000, category: 1 },
        { title: "Jean Slim Noir", description: "Jean slim coupe moderne", price: 35000, category: 1 },
        { title: "Robe d'été Fleurie", description: "Robe légère pour l'été", price: 45000, category: 1 },
        { title: "Sneakers Blanches", description: "Baskets tendance unisexe", price: 65000, category: 1 },
        { title: "Canapé 3 Places", description: "Canapé confortable en tissu", price: 250000, category: 2 },
        { title: "Aspirateur Robot", description: "Aspirateur automatique intelligent", price: 150000, category: 2 },
        { title: "Plantes d'intérieur", description: "Set de 5 plantes vertes", price: 25000, category: 2 },
        { title: "Lampe LED Design", description: "Lampe moderne à LED", price: 35000, category: 2 },
        { title: "Vélo VTT", description: "Vélo tout-terrain 21 vitesses", price: 180000, category: 3 },
        { title: "Ballon de Football", description: "Ballon officiel FIFA", price: 12000, category: 3 },
        { title: "Raquette de Tennis", description: "Raquette professionnelle", price: 85000, category: 3 },
        { title: "Tapis de Yoga", description: "Tapis antidérapant premium", price: 18000, category: 3 },
        { title: "Roman Bestseller", description: "Roman à succès de l'année", price: 8000, category: 4 },
        { title: "Livre de Cuisine", description: "Recettes du monde entier", price: 15000, category: 4 },
        { title: "Film Blu-ray", description: "Film dernière sortie", price: 12000, category: 4 },
        { title: "Jeu de Société", description: "Jeu familial stratégique", price: 22000, category: 4 },
      ];

      let produitIndex = 0;
      for (const vendeur of vendeurs) {
        const produitsVendeur = produitsExemples
          .slice(produitIndex, produitIndex + 4)
          .map((p) =>
            prisma.product.create({
              data: {
                title: `${p.title} - ${vendeur.name.split(" ")[0]}`,
                description: p.description,
                price: p.price,
                status: Math.random() > 0.3 ? ProductStatus.VALIDE : ProductStatus.EN_ATTENTE,
                dateExpiration: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                userId: vendeur.id,
                categoryId: categories[p.category].id,
                images: {
                  create: [
                    { url: `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 1000)}` },
                    { url: `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 1000) + 1}` },
                  ],
                },
              },
            })
          );

        await Promise.all(produitsVendeur);
        produitIndex += 4;
        console.log(`✅ Produits créés pour ${vendeur.name}`);
      }
    } else {
      console.log(`✅ Produits déjà existants (${existingProductsCount}), création ignorée`);
    }

    // === 5️⃣ Utilisateur visiteur ===
    const visiteur = await prisma.user.upsert({
      where: { email: "visiteur@ecommerce.sn" },
      update: {
        name: "Visiteur Test",
        password: passwordHash,
        telephone: "+221776789012",
        adresse: "Thiès, Sénégal",
        role: UserRole.VISITEUR,
      },
      create: {
        name: "Visiteur Test",
        email: "visiteur@ecommerce.sn",
        password: passwordHash,
        telephone: "+221776789012",
        adresse: "Thiès, Sénégal",
        role: UserRole.VISITEUR,
      },
    });

    console.log(`✅ Visiteur créé: ${visiteur.email}`);

    // === 📊 Résumé ===
    const [totalUsers, totalProducts, totalCategories] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.category.count(),
    ]);

    console.log(`
🎉 SEED TERMINÉ AVEC SUCCÈS !
========================
👥 Utilisateurs créés: ${totalUsers}
   - 1 Super Admin: ${superAdmin.email}
   - 5 Vendeurs
   - 1 Visiteur
📦 Produits créés: ${totalProducts}
🏷️ Catégories créées: ${totalCategories}
🔑 Mot de passe commun: admin123
========================
`);
  } catch (error) { 
    console.error(" Erreur lors du seed:", error);
    // process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

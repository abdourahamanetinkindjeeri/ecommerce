import cron from "node-cron";
import prisma from "../prismaClient.js";

// Supprime les produits dont la date d'expiration est dépassée
async function deleteExpiredProducts() {
  const now = new Date();
  const deleted = await prisma.product.deleteMany({
    where: {
      dateExpiration: {
        lt: now,
      },
    },
  });
  console.log(`${deleted.count} produit(s) expiré(s) supprimé(s)`);
}

// Renouvelle la publication d'un produit (ajoute 7 jours à la date d'expiration)
async function renewProduct(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    throw new Error('Produit non trouvé');
  }

  if (product.dateExpiration && product.dateExpiration < new Date()) {
    throw new Error('Produit expiré, impossible de renouveler');
  }

  const newExpirationDate = new Date(product.dateExpiration || new Date());
  newExpirationDate.setDate(newExpirationDate.getDate() + 7);

  await prisma.product.update({
    where: { id: productId },
    data: { dateExpiration: newExpirationDate },
  });
  console.log(`Produit ${productId} renouvelé jusqu'au ${newExpirationDate.toISOString()}.`);
}

// Envoie des rappels de renouvellement pour les produits expirant dans moins de 2 jours
async function sendRenewalReminders() {
  const now = new Date();
  const twoDaysFromNow = new Date(now);
  twoDaysFromNow.setDate(now.getDate() + 2);

  // Trouver les produits expirant dans moins de 2 jours
  const productsToRemind = await prisma.product.findMany({
    where: {
      dateExpiration: {
        gte: now,
        lte: twoDaysFromNow,
      },
      status: 'VALIDE',
    },
    include: {
      user: true,
      notifications: {
        where: {
          type: 'RENEWAL_REMINDER',
          createdAt: {
            gte: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Pas de rappel dans les dernières 24h
          },
        },
      },
    },
  });

  for (const product of productsToRemind) {
    // Vérifier si un rappel a déjà été envoyé récemment
    if (product.notifications.length === 0) {
      await prisma.notification.create({
        data: {
          message: `Votre produit "${product.title}" expire bientôt. Pensez à le renouveler pour continuer à le publier.`,
          type: 'RENEWAL_REMINDER',
          userId: product.userId,
          productId: product.id,
        },
      });
      console.log(`Rappel envoyé au vendeur pour le produit ${product.id}`);
    }
  }
}

// Exemple d'utilisation

// Tâche automatique chaque jour à minuit
cron.schedule("0 0 * * *", async () => {
  console.log("Suppression automatique des produits expirés...");
  await deleteExpiredProducts();

  console.log("Envoi des rappels de renouvellement...");
  await sendRenewalReminders();
});

export { deleteExpiredProducts, renewProduct, sendRenewalReminders };

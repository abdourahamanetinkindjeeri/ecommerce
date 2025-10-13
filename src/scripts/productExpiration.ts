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

// Exemple d'utilisation

// Tâche automatique chaque jour à minuit
cron.schedule("0 0 * * *", async () => {
  console.log("Suppression automatique des produits expirés...");
  await deleteExpiredProducts();
});

export { deleteExpiredProducts, renewProduct };

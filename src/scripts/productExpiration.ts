import cron from "node-cron";
import prisma from "../prismaClient.js";

// Supprime les produits publiés depuis plus de 7 jours
async function deleteExpiredProducts() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const deleted = await prisma.product.deleteMany({
    where: {
      createdAt: {
        lt: sevenDaysAgo,
      },
    },
  });
  console.log(`${deleted.count} produit(s) supprimé(s)`);
}

// Renouvelle la publication d'un produit (remet à jour la date de publication)
async function renewProduct(productId: string) {
  await prisma.product.update({
    where: { id: productId },
    data: { createdAt: new Date() },
  });
  console.log(`Produit ${productId} renouvelé.`);
}

// Exemple d'utilisation

// Tâche automatique chaque jour à minuit
cron.schedule("0 0 * * *", async () => {
  console.log("Suppression automatique des produits expirés...");
  await deleteExpiredProducts();
});

export { deleteExpiredProducts, renewProduct };

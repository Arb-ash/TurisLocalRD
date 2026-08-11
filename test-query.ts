import { prisma } from './lib/db'; 
async function main() { 
  console.log(await prisma.experience.findMany()); 
} 
main();

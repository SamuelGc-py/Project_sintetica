import { Role } from "@prisma/client";
import { prisma } from "@/backend/db/prisma";
import { mockUsers } from "@/backend/services/mock-data";

export async function getCustomers() {
  try {
    const users = await prisma.user.findMany({
      where: { role: Role.CLIENT },
      include: {
        _count: {
          select: { reservations: true, teams: true, payments: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      reservations: user._count.reservations,
      teams: user._count.teams,
      payments: user._count.payments
    }));
  } catch {
    return mockUsers.map((user, index) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      reservations: index === 0 ? 2 : 0,
      teams: index === 0 ? 1 : 1,
      payments: index === 0 ? 2 : 0
    }));
  }
}

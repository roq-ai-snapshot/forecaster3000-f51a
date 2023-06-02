import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { userStartupValidationSchema } from 'validationSchema/user-startups';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getUserStartups();
    case 'POST':
      return createUserStartup();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getUserStartups() {
    const data = await prisma.user_startup
      .withAuthorization({
        userId: roqUserId,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'user_startup'));
    return res.status(200).json(data);
  }

  async function createUserStartup() {
    await userStartupValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.user_startup.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}

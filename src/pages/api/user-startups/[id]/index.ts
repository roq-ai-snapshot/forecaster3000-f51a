import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { userStartupValidationSchema } from 'validationSchema/user-startups';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  await prisma.user_startup
    .withAuthorization({ userId: roqUserId })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getUserStartupById();
    case 'PUT':
      return updateUserStartupById();
    case 'DELETE':
      return deleteUserStartupById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getUserStartupById() {
    const data = await prisma.user_startup.findFirst(convertQueryToPrismaUtil(req.query, 'user_startup'));
    return res.status(200).json(data);
  }

  async function updateUserStartupById() {
    await userStartupValidationSchema.validate(req.body);
    const data = await prisma.user_startup.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteUserStartupById() {
    const data = await prisma.user_startup.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}

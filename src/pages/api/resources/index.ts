import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { resourceValidationSchema } from 'validationSchema/resources';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getResources();
    case 'POST':
      return createResource();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getResources() {
    const data = await prisma.resource
      .withAuthorization({
        userId: roqUserId,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'resource'));
    return res.status(200).json(data);
  }

  async function createResource() {
    await resourceValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.resource.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}

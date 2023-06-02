import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { startupValidationSchema } from 'validationSchema/startups';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getStartups();
    case 'POST':
      return createStartup();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getStartups() {
    const data = await prisma.startup
      .withAuthorization({
        userId: roqUserId,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'startup'));
    return res.status(200).json(data);
  }

  async function createStartup() {
    await startupValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.financial_model?.length > 0) {
      const create_financial_model = body.financial_model;
      body.financial_model = {
        create: create_financial_model,
      };
    } else {
      delete body.financial_model;
    }
    if (body?.user_startup?.length > 0) {
      const create_user_startup = body.user_startup;
      body.user_startup = {
        create: create_user_startup,
      };
    } else {
      delete body.user_startup;
    }
    const data = await prisma.startup.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}

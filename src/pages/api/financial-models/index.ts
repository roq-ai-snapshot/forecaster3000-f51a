import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { financialModelValidationSchema } from 'validationSchema/financial-models';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getFinancialModels();
    case 'POST':
      return createFinancialModel();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getFinancialModels() {
    const data = await prisma.financial_model
      .withAuthorization({
        userId: roqUserId,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'financial_model'));
    return res.status(200).json(data);
  }

  async function createFinancialModel() {
    await financialModelValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.key_metric?.length > 0) {
      const create_key_metric = body.key_metric;
      body.key_metric = {
        create: create_key_metric,
      };
    } else {
      delete body.key_metric;
    }
    const data = await prisma.financial_model.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { financialModelValidationSchema } from 'validationSchema/financial-models';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  await prisma.financial_model
    .withAuthorization({ userId: roqUserId })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getFinancialModelById();
    case 'PUT':
      return updateFinancialModelById();
    case 'DELETE':
      return deleteFinancialModelById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getFinancialModelById() {
    const data = await prisma.financial_model.findFirst(convertQueryToPrismaUtil(req.query, 'financial_model'));
    return res.status(200).json(data);
  }

  async function updateFinancialModelById() {
    await financialModelValidationSchema.validate(req.body);
    const data = await prisma.financial_model.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteFinancialModelById() {
    const data = await prisma.financial_model.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { keyMetricValidationSchema } from 'validationSchema/key-metrics';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  await prisma.key_metric
    .withAuthorization({ userId: roqUserId })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getKeyMetricById();
    case 'PUT':
      return updateKeyMetricById();
    case 'DELETE':
      return deleteKeyMetricById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getKeyMetricById() {
    const data = await prisma.key_metric.findFirst(convertQueryToPrismaUtil(req.query, 'key_metric'));
    return res.status(200).json(data);
  }

  async function updateKeyMetricById() {
    await keyMetricValidationSchema.validate(req.body);
    const data = await prisma.key_metric.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteKeyMetricById() {
    const data = await prisma.key_metric.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}

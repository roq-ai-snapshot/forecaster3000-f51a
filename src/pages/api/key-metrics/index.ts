import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { keyMetricValidationSchema } from 'validationSchema/key-metrics';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getKeyMetrics();
    case 'POST':
      return createKeyMetric();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getKeyMetrics() {
    const data = await prisma.key_metric
      .withAuthorization({
        userId: roqUserId,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'key_metric'));
    return res.status(200).json(data);
  }

  async function createKeyMetric() {
    await keyMetricValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.key_metric.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}

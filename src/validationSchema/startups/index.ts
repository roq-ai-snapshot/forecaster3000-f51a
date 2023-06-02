import * as yup from 'yup';
import { financialModelValidationSchema } from 'validationSchema/financial-models';
import { userStartupValidationSchema } from 'validationSchema/user-startups';

export const startupValidationSchema = yup.object().shape({
  name: yup.string().required(),
  owner_id: yup.string().nullable().required(),
  financial_model: yup.array().of(financialModelValidationSchema),
  user_startup: yup.array().of(userStartupValidationSchema),
});

import * as yup from 'yup';
import { keyMetricValidationSchema } from 'validationSchema/key-metrics';

export const financialModelValidationSchema = yup.object().shape({
  created_at: yup.date().required(),
  updated_at: yup.date().required(),
  startup_id: yup.string().nullable().required(),
  key_metric: yup.array().of(keyMetricValidationSchema),
});

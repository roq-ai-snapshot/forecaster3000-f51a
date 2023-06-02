import * as yup from 'yup';

export const keyMetricValidationSchema = yup.object().shape({
  name: yup.string().required(),
  value: yup.number().required(),
  financial_model_id: yup.string().nullable().required(),
});

import * as yup from 'yup';

export const userStartupValidationSchema = yup.object().shape({
  user_id: yup.string().nullable().required(),
  startup_id: yup.string().nullable().required(),
});

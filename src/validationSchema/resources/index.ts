import * as yup from 'yup';

export const resourceValidationSchema = yup.object().shape({
  title: yup.string().required(),
  content: yup.string().required(),
  resource_type: yup.string().required(),
});

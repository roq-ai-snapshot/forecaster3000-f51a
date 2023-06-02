import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik, FormikHelpers } from 'formik';
import { getKeyMetricById, updateKeyMetricById } from 'apiSdk/key-metrics';
import { Error } from 'components/error';
import { keyMetricValidationSchema } from 'validationSchema/key-metrics';
import { KeyMetricInterface } from 'interfaces/key-metric';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { FinancialModelInterface } from 'interfaces/financial-model';
import { getFinancialModels } from 'apiSdk/financial-models';

function KeyMetricEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<KeyMetricInterface>(
    () => (id ? `/key-metrics/${id}` : null),
    () => getKeyMetricById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: KeyMetricInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateKeyMetricById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<KeyMetricInterface>({
    initialValues: data,
    validationSchema: keyMetricValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Key Metric
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
              <FormLabel>name</FormLabel>
              <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
              {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
            </FormControl>
            <FormControl id="value" mb="4" isInvalid={!!formik.errors?.value}>
              <FormLabel>value</FormLabel>
              <NumberInput
                name="value"
                value={formik.values?.value}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('value', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors?.value && <FormErrorMessage>{formik.errors?.value}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<FinancialModelInterface>
              formik={formik}
              name={'financial_model_id'}
              label={'financial_model_id'}
              placeholder={'Select Financial Model'}
              fetcher={getFinancialModels}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.id}
                </option>
              )}
            />
            <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'key_metric',
  operation: AccessOperationEnum.UPDATE,
})(KeyMetricEditPage);

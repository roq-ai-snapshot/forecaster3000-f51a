import axios from 'axios';
import queryString from 'query-string';
import { FinancialModelInterface } from 'interfaces/financial-model';
import { GetQueryInterface } from '../../interfaces';

export const getFinancialModels = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/financial-models${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createFinancialModel = async (financialModel: FinancialModelInterface) => {
  const response = await axios.post('/api/financial-models', financialModel);
  return response.data;
};

export const updateFinancialModelById = async (id: string, financialModel: FinancialModelInterface) => {
  const response = await axios.put(`/api/financial-models/${id}`, financialModel);
  return response.data;
};

export const getFinancialModelById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/financial-models/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteFinancialModelById = async (id: string) => {
  const response = await axios.delete(`/api/financial-models/${id}`);
  return response.data;
};

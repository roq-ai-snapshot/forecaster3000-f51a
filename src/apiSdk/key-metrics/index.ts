import axios from 'axios';
import queryString from 'query-string';
import { KeyMetricInterface } from 'interfaces/key-metric';
import { GetQueryInterface } from '../../interfaces';

export const getKeyMetrics = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/key-metrics${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createKeyMetric = async (keyMetric: KeyMetricInterface) => {
  const response = await axios.post('/api/key-metrics', keyMetric);
  return response.data;
};

export const updateKeyMetricById = async (id: string, keyMetric: KeyMetricInterface) => {
  const response = await axios.put(`/api/key-metrics/${id}`, keyMetric);
  return response.data;
};

export const getKeyMetricById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/key-metrics/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteKeyMetricById = async (id: string) => {
  const response = await axios.delete(`/api/key-metrics/${id}`);
  return response.data;
};

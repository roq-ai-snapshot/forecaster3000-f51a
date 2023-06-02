import axios from 'axios';
import queryString from 'query-string';
import { StartupInterface } from 'interfaces/startup';
import { GetQueryInterface } from '../../interfaces';

export const getStartups = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/startups${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createStartup = async (startup: StartupInterface) => {
  const response = await axios.post('/api/startups', startup);
  return response.data;
};

export const updateStartupById = async (id: string, startup: StartupInterface) => {
  const response = await axios.put(`/api/startups/${id}`, startup);
  return response.data;
};

export const getStartupById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/startups/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteStartupById = async (id: string) => {
  const response = await axios.delete(`/api/startups/${id}`);
  return response.data;
};

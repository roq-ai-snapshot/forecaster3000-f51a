import axios from 'axios';
import queryString from 'query-string';
import { UserStartupInterface } from 'interfaces/user-startup';
import { GetQueryInterface } from '../../interfaces';

export const getUserStartups = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/user-startups${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createUserStartup = async (userStartup: UserStartupInterface) => {
  const response = await axios.post('/api/user-startups', userStartup);
  return response.data;
};

export const updateUserStartupById = async (id: string, userStartup: UserStartupInterface) => {
  const response = await axios.put(`/api/user-startups/${id}`, userStartup);
  return response.data;
};

export const getUserStartupById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/user-startups/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteUserStartupById = async (id: string) => {
  const response = await axios.delete(`/api/user-startups/${id}`);
  return response.data;
};

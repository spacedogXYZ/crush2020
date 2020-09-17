import React from 'react';
import { Store } from './src/state/context';

export const wrapRootElement = ({ element }) => (
  <Store>{element}</Store>
)

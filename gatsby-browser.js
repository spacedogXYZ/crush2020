import React from 'react';
import { Store } from './src/state/context';
import { CookiesProvider } from 'react-cookie';

export const wrapRootElement = ({ element }) => (
  <CookiesProvider>
    <Store>
      {element}
    </Store>
  </CookiesProvider>
)

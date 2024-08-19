// src/intlSetup.js
import { createIntl, createIntlCache } from 'react-intl';

// This is optional but highly recommended
// since it prevents memory leak
const cache = createIntlCache();

const intl = createIntl({
  locale: 'en', // default locale
  messages: {}
}, cache);

export default intl;

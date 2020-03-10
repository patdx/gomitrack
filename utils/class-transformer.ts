// Seems like it is hard to inject polyfills into Next.js
// for it's static building phase. So, instead we run every
// reference to class-transformer through this file. That way,
// we ensure that 'reflect-metadata' is properly loaded. Even in
// next build.

import 'reflect-metadata';
export * from 'class-transformer';

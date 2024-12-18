// eslint-disable-next-line
declare const window: any;

// @see: https://pumpingco.de/blog/environment-variables-angular-docker/
export const environment = {
  production: true,
  siteName: window.env?.siteName || 'Agenda Manager',
  apiUrl: window.env?.apiUrl || 'https://localhost:7000',
  siteUrl: window.env?.siteUrl || 'http://localhost:4200',
  apiSegment: window.env?.apiSegment || 'api/v1',
  defaultLocale: window.env?.locale || 'es',
};

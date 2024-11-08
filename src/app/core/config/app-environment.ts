import { environment } from '../../../environments/environment';

/** Wrapper para obtener la configuración en base al environment. */
export const AppEnvironment = {
  siteName: environment.siteName,
  apiUrl: environment.apiUrl,
  apiSegment: environment.apiSegment,
  baseApiUrl: `${environment.apiUrl}/${environment.apiSegment}`,
  siteUrl: environment.siteUrl,
  isDebug: !environment.production,
};

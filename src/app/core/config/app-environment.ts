import { environment } from '../../../environments/environment';

/** Wrapper para obtener la configuración en base al environment. */
export const AppEnvironment = {
  SiteName: environment.siteName,
  ApiUrl: environment.apiUrl,
  ApiSegment: environment.apiSegment,
  BaseApiUrl: `${environment.apiUrl}/${environment.apiSegment}`,
  SiteUrl: environment.siteUrl,
  IsDebug: !environment.production,
  DefaultLocale: environment.defaultLocale,
};

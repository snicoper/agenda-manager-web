import { AppEnvironment } from '../../../core/config/app-environment';

export abstract class UrlUtils {
  /**
   * Utiliza una de las propiedades de URLs para reemplazar {algo} por el valor en los args.
   * Se utiliza para las URLs de la API.
   *
   * @param endpoint Una de las propiedades.
   * @param args Reemplaza el {key} por el value en los args.
   * @returns La URL formateada.
   */
  static buildApiUrl(endpoint: string, args?: Record<string, string>): string {
    return `${AppEnvironment.BaseApiUrl}${UrlUtils.buildUrl(endpoint, args)}`;
  }

  /**
   * Utiliza una de las propiedades de URLs para reemplazar {algo} por el valor en los args.
   * Se utiliza para las URLs de la web.
   *
   * @param endpoint Una de las propiedades.
   * @param args Reemplaza el {key} por el value en los args.
   * @returns La URL formateada.
   */
  static buildSiteUrl(endpoint: string, args?: Record<string, string>): string {
    return UrlUtils.buildUrl(endpoint, args);
  }

  /**
   * Reemplaza los marcadores de posición en el endpoint con valores proporcionados.
   *
   * @param endpoint La ruta del endpoint que contiene marcadores de posición en el formato {clave}.
   * @param args Un objeto que contiene los pares clave-valor para reemplazar en el endpoint.
   * @returns El endpoint formateado con los valores reemplazados.
   */
  private static buildUrl(endpoint: string, args?: Record<string, string>): string {
    if (!args) {
      return endpoint;
    }

    const keys = Object.keys(args);
    const values = Object.values(args);

    // Reemplaza cada clave en el endpoint con su correspondiente valor.
    for (let i = 0; i < keys.length; i++) {
      const key = `{${keys[i]}}`;
      const value = encodeURIComponent(values[i]);
      endpoint = endpoint.replace(key, value);
    }

    return endpoint;
  }
}

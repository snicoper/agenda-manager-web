import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrls } from '../../../../../../core/config/api-urls';
import { ApiBaseService } from '../../../../../../core/services/api/api.base.service';
import { UrlUtils } from '../../../../../../core/utils/url/url.utils';
import { AccountSelectorResponse } from '../../models/responses/account-selecter.response';

@Injectable({ providedIn: 'root' })
export class AccountSelectorApiService extends ApiBaseService {
  /** Filtrar usuarios. */
  filterAccounts(term: string, pageSize: number): Observable<AccountSelectorResponse[]> {
    const endpoint = UrlUtils.buildApiUrl(ApiUrls.accounts.filterAccounts, {
      term: term,
      pageSize: pageSize.toString(),
    });

    return this.get<AccountSelectorResponse[]>(endpoint, (response) => response.value as AccountSelectorResponse[]);
  }
}

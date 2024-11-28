# Agenda Manager Web

```ts

@Injectable({ providedIn: 'root' })
export class UserService extends ApiBaseService {
  getUsers(apiResult: ApiResult<User>): Observable<ApiResult<User>> {
    return this.getPaginated(
      apiResult,
      'users',
      response => response.value as ApiResult<User>
    );
  }
}
```

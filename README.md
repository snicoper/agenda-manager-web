# Agenda Manager Web

```typescript
login(loginRequest: LoginRequest): Observable<boolean> {
    this.updateAuthState(true, false);

    return this.authApiService.login(loginRequest).pipe(
      map((response) => {
        this.updateAuthState(false, true);
        this.setTokenFromLoginResponse(response);

        return true;
      }),
    );
  }
```

```typescript
it('should handle login error', (done) => {
      const errorResponse = new Error('Login failed');
      authApiService.login.and.returnValue(throwError(() => errorResponse));

      authService.login(loginRequest).subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
          expect(authService.authState.isLoggedIn()).toBeFalse();
          expect(authService.authState.isLoading()).toBeFalse();
          done();
        },
      });
    });
```

```txt
AuthService > login > should handle login error
Expected true to be false.
    at <Jasmine>
    at Object.error (http://localhost:9876/_karma_webpack_/webpack:/src/app/core/auth/services/auth.service.spec.ts:79:53)
    at ConsumerObserver.error (http://localhost:9876/_karma_webpack_/webpack:/node_modules/rxjs/dist/esm/internal/Subscriber.js:102:33)
    at SafeSubscriber._error (http://localhost:9876/_karma_webpack_/webpack:/node_modules/rxjs/dist/esm/internal/Subscriber.js:64:30)
    at SafeSubscriber.error (http://localhost:9876/_karma_webpack_/webpack:/node_modules/rxjs/dist/esm/internal/Subscriber.js:40:18)
```

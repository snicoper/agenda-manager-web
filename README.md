# Agenda Manager Web

Veo que tambien tengo un timezone

```typescript
@Injectable({ providedIn: 'root' })
export class TimeZoneState extends BaseState<string> {
  override refresh(): void {
    this.set(LocalizationUtils.defaultTimezone);
    Settings.defaultZone = this.get()!;
  }

  override set(timezone: string): void {
    super.set(timezone);
    Settings.defaultZone = timezone;
  }
}
```

En el effect de LuxonDateTimeService debería añadir tambien que cambie el `Settings.defaultZone = timezone;`

Que opinas?

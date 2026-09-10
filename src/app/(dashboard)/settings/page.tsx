import { requireUser } from "@/server/auth/session";
import { getOrganizationWithRestaurants } from "@/server/repositories/organization.repository";
import { isDemoMode } from "@/server/demo/demo-mode";
import { DEMO_ORGANIZATION, DEMO_RESTAURANTS } from "@/server/demo/demo-data";

export default async function SettingsPage() {
  const user = await requireUser();
  const organization = isDemoMode()
    ? { name: DEMO_ORGANIZATION.name, restaurants: DEMO_RESTAURANTS }
    : await getOrganizationWithRestaurants(user.organizationId);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-foreground">Настройки</h1>

      <section className="rounded-2xl bg-surface shadow-[var(--shadow-card)] ring-1 ring-[var(--border)] p-4">
        <h2 className="text-sm font-medium text-foreground">Организация</h2>
        <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">
          <dt className="text-foreground-subtle">Название</dt>
          <dd className="text-foreground">{organization?.name}</dd>
          <dt className="text-foreground-subtle">Рестораны</dt>
          <dd className="text-foreground">{organization?.restaurants.length ?? 0}</dd>
          <dt className="text-foreground-subtle">Ваша роль</dt>
          <dd className="text-foreground">{user.role === "OWNER" ? "Владелец" : "Менеджер"}</dd>
        </dl>
      </section>

      <section className="rounded-2xl bg-surface shadow-[var(--shadow-card)] ring-1 ring-[var(--border)] p-4">
        <h2 className="text-sm font-medium text-foreground">Интеграция с iiko</h2>
        <div className="mt-2 flex items-center gap-2 text-sm">
          <span className="h-2 w-2 rounded-full bg-foreground-subtle" />
          <span className="text-foreground-muted">Не подключено</span>
        </div>
        <p className="mt-1 text-sm text-foreground-subtle">
          Подключение появится после discovery-этапа (Phase 3) — нужна документация и доступ к iiko API.
        </p>
      </section>
    </div>
  );
}

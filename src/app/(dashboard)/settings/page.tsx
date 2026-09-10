import { requireUser } from "@/server/auth/session";
import { getOrganizationWithRestaurants } from "@/server/repositories/organization.repository";
import { isDemoMode } from "@/server/demo/demo-mode";
import { DEMO_RESTAURANTS } from "@/server/demo/demo-data";
import { getDemoOrgName } from "@/server/demo/demo-org-store";
import { BASE_DEMO_USERS } from "@/server/demo/demo-users";
import { getAddedDemoUsers } from "@/server/demo/demo-user-store";
import { EditOrgNameForm } from "@/components/settings/EditOrgNameForm";
import { InviteUserForm } from "@/components/settings/InviteUserForm";
import { RemoveUserButton } from "@/components/settings/RemoveUserButton";

export default async function SettingsPage() {
  const user = await requireUser();
  const demo = isDemoMode();

  const organization = demo
    ? { name: await getDemoOrgName(), restaurants: DEMO_RESTAURANTS }
    : await getOrganizationWithRestaurants(user.organizationId);

  const demoUsers = demo ? [...BASE_DEMO_USERS, ...(await getAddedDemoUsers())] : [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-[26px] font-semibold tracking-tight text-foreground">Настройки</h1>

      <section className="rounded-2xl bg-surface shadow-[var(--shadow-card)] ring-1 ring-[var(--border)] p-4">
        <h2 className="text-sm font-medium text-foreground">Организация</h2>
        <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">
          <dt className="text-foreground-subtle">Название</dt>
          <dd>
            {demo ? (
              <EditOrgNameForm initialName={organization?.name ?? ""} />
            ) : (
              <span className="text-foreground">{organization?.name}</span>
            )}
          </dd>
          <dt className="text-foreground-subtle">Рестораны</dt>
          <dd className="text-foreground">{organization?.restaurants.length ?? 0}</dd>
          <dt className="text-foreground-subtle">Ваша роль</dt>
          <dd className="text-foreground">{user.role === "OWNER" ? "Владелец" : "Менеджер"}</dd>
        </dl>
      </section>

      {user.role === "OWNER" ? (
        <section className="rounded-2xl bg-surface shadow-[var(--shadow-card)] ring-1 ring-[var(--border)] p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-medium text-foreground">Пользователи</h2>
          </div>
          <p className="mt-1 text-sm text-foreground-subtle">
            Владелец видит все рестораны сети. Менеджеру доступ выдаётся точечно, по ресторанам.
          </p>

          {demo ? (
            <>
              <div className="mt-4 flex flex-col gap-2">
                {demoUsers.map((u) => (
                  <div
                    key={u.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-[10px] bg-surface-secondary px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-foreground">
                        {u.name} <span className="text-foreground-subtle">· {u.email}</span>
                      </div>
                      <div className="text-xs text-foreground-muted">
                        {u.role === "OWNER" ? "Владелец · все рестораны" : "Менеджер"}
                        {u.role === "MANAGER" && u.restaurantIds.length > 0 && (
                          <>
                            {" · "}
                            {DEMO_RESTAURANTS.filter((r) => u.restaurantIds.includes(r.id))
                              .map((r) => r.name)
                              .join(", ")}
                          </>
                        )}
                      </div>
                    </div>
                    {!u.id.startsWith("seed-") && <RemoveUserButton userId={u.id} />}
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <InviteUserForm restaurants={DEMO_RESTAURANTS} />
              </div>
            </>
          ) : (
            <p className="mt-3 text-sm text-foreground-subtle">
              Управление пользователями появится вместе с реальной базой данных (сейчас — демо-режим).
            </p>
          )}
        </section>
      ) : (
        <section className="rounded-2xl bg-surface shadow-[var(--shadow-card)] ring-1 ring-[var(--border)] p-4 text-sm text-foreground-muted">
          Управление пользователями доступно только владельцу аккаунта.
        </section>
      )}

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

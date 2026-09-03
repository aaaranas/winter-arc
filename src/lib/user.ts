/**
 * The app is single-user. Every row is written with this id so that adding real
 * auth later is a matter of replacing this one function with a session lookup,
 * not a migration.
 */
export const LOCAL_USER_ID = 'local';

export function currentUserId(): string {
  return LOCAL_USER_ID;
}

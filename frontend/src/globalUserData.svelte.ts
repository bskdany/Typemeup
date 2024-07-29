export const userData: { username: string } = $state({
  username: ""
});
export function isLoggedIn(): boolean { return userData.username?.length > 0 }

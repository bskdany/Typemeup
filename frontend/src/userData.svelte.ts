import type { UserTypingConfig } from "./types/config";

export const userData: { username: string, userTypingConfig: UserTypingConfig } = $state({
  username: "",
  userTypingConfig: {
    errorCorrectionMode: 3,
    fingerMap: [
      ['q', 'a', 'z'],
      ['w', 's', 'x'],
      ['e', 'd', 'c'],
      ['r', 'f', 'v', 't', 'g', 'b'],
      ['u', 'j', 'm', 'y', 'h', 'h', 'n'],
      ['i', 'k', ','],
      ['o', 'l', '.'],
      ['p', ';', '/'],
      [' '],
      []
    ],
    defaultFingersPosition: ["a", "s", "d", "f", "j", "k", "l", ";", " ", ""]
  }
});

export function isLoggedIn(): boolean { return userData.username?.length > 0 }

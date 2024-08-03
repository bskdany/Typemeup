import type { UserTypingConfig } from "../types/interfaces";

export const typingEndModes = ['time', 'words'] as const;
export const typingEndWordModes = [10, 25, 50, 100];
export const typingEndTimeModes = [15, 30, 60, 120];
export const allTypingEndModes = ['words 10', 'words 25', 'words 50', 'words 100', 'time 15', 'time 30', 'time 60', 'time 120'];

export const userData: { username: string, userTypingConfig: UserTypingConfig } = $state({
  username: "",
  userTypingConfig: {
    errorCorrectionMode: 3,
    typingMode: "test",
    typingEndMode: "time",
    typingEndTimeMode: 60,
    typingEndWordMode: 50,
    smartModeConfig: {
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
      defaultFingersPosition: ["a", "s", "d", "f", "j", "k", "l", ";", " ", ""],
    }
  }
});

export function isLoggedIn(): boolean { return userData.username?.length > 0 }
export function getCombinedTypingEndMode(): string { return userData.userTypingConfig.typingEndMode + " " + (userData.userTypingConfig.typingEndMode === "time" ? userData.userTypingConfig.typingEndTimeMode : userData.userTypingConfig.typingEndWordMode) };
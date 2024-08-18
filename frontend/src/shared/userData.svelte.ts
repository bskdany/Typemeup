import type { KeyStatistic } from "@shared/types";
import type { ColorScheme, UserTypingConfig } from "../types/interfaces";

export const typingModes = ['test', 'smart'] as const;
export const typingEndModes = ['time', 'words'] as const;
export const typingEndWordModes = [10, 25, 50, 100];
export const typingEndTimeModes = [15, 30, 60, 120];
export const allTypingEndModes = ['words 10', 'words 25', 'words 50', 'words 100', 'time 15', 'time 30', 'time 60', 'time 120'];

export const userData: { username: string, userTypingConfig: UserTypingConfig, keyStatistics: KeyStatistic[], colorScheme: ColorScheme } = $state({
  username: "",
  userTypingConfig: {} as UserTypingConfig,
  keyStatistics: [] as KeyStatistic[],
  colorScheme: {
    backgroundColor: { name: 'Background', value: '#171d1f' },
    primaryColor: { name: 'Primary', value: '#2c2e31' },
    secondaryColor: { name: 'Secondary', value: '#7f6a6a' },
    accentColor: { name: 'Accent', value: '#a8b9e4' },
    textColor: { name: 'Text', value: '#ffffff' }
  } as ColorScheme
} as const);

export function isLoggedIn(): boolean { return userData.username?.length > 0 }
export function isSessionFresh(): boolean { return userData.keyStatistics.length === 0 }
export function getCombinedTypingEndMode(): string { return userData.userTypingConfig.typingEndMode + " " + (userData.userTypingConfig.typingEndMode === "time" ? userData.userTypingConfig.typingEndTimeMode : userData.userTypingConfig.typingEndWordMode) };
import type { KeyStatistic, UserTypingConfig } from "@shared/types";
import { fetchBackend } from "../lib/fetch";

export const typingModes = ["test", "smart", "compete"] as const;
export const typingEndModes = ["time", "words"] as const;
export const typingEndWordModes = [10, 25, 50, 100];
export const typingEndTimeModes = [15, 30, 60, 120];
export const allTypingEndModes = [
    "words 10",
    "words 25",
    "words 50",
    "words 100",
    "time 15",
    "time 30",
    "time 60",
    "time 120",
];

export let userData: {
    username: string;
    userTypingConfig: UserTypingConfig;
    keyStatistics: KeyStatistic[];
};

async function saveTypingConfig() {
    if (isLoggedIn()) {
        try {
            await fetchBackend(fetch, "/profile/saveUserTypingConfig", {
                method: "POST",
                body: { userTypingConfig: userData.userTypingConfig },
            });
        } catch (e) {
            console.error(e);
        }
    }
}

export async function initUserData(data: any) {
    function createProxy(obj: any) {
        return new Proxy(obj, {
            get(target, prop) {
                const value = target[prop];
                // If it's an object, wrap it in a proxy too
                if (value && typeof value === "object") {
                    return createProxy(value);
                }
                return value;
            },

            set(target, prop, value) {
                saveTypingConfig(); // the function is not awaited
                console.log("SETTING");
                target[prop] = value;
                return true;
            },
        });
    }
    const username = $state(data.username);
    const reactiveUserTypingConfig = $state(JSON.parse(data.userTypingConfig));
    const reactiveKeyStatistics = $state(JSON.parse(data.keyStatistics));
    const userTypingConfig = createProxy(reactiveUserTypingConfig);
    const keyStatistics = createProxy(reactiveKeyStatistics);

    userData = {
        username: username,
        userTypingConfig: userTypingConfig,
        keyStatistics: keyStatistics,
    };

    await loadWordsFile(userData?.userTypingConfig?.typingLanguage);
    setInitialized(true);
}

let wordsFile: any;

export async function loadWordsFile(value: any) {
    await import(`../static/languages/${value}.json`).then((file) => {
        wordsFile = file;
        userData.userTypingConfig.typingLanguage = value;
    });
}

export function getWordsFile() {
    return wordsFile;
}

let initialized = false;
export function setInitialized(value: boolean): void {
    initialized = value;
}

export function hasInitialized(): Promise<boolean> {
    return new Promise((resolve, reject) => {
        if (initialized) {
            resolve(true);
        } else {
            reject(false);
        }
    });
}

export function isLoggedIn(): boolean {
    if (userData) {
        return userData.username?.length > 0;
    } else return false;
}
export function isSessionFresh(): boolean {
    if (userData) {
        return false;
    } else return true;
}
export function getCombinedTypingEndMode(): string {
    return (
        userData.userTypingConfig.typingEndMode +
        " " +
        (userData.userTypingConfig.typingEndMode === "time"
            ? userData.userTypingConfig.typingEndTimeMode
            : userData.userTypingConfig.typingEndWordMode)
    );
}

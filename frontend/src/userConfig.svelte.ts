import type { Config } from "./types/config";

export const userConfig: Config = $state({
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
  ]
})
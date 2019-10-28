

export const MonacoConfig = {
    languageTokens: [
        [/W/, "character-W"],
        [/-/, "character--"],
        [/I/, "character-I"],
        [/D/, "character-D"],
        [/E/, "character-E"],
    ],

    colorRules: [
        { token: 'character-W', foreground: 'FFFFFF' },
        { token: 'character--', foreground: 'dbd9d5' },
        { token: 'character-I', foreground: '3e70f7' },
        { token: 'character-D', foreground: 'fc7a00' },
        { token: 'character-E', foreground: 'e6b000' },
    ]
}
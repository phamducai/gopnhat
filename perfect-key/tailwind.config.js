/* eslint-disable @typescript-eslint/no-var-requires */
const themeDefine = require('./src/theme/theme-define');
const plugin = require('tailwindcss/plugin');
const {palette} = themeDefine;

module.exports = {
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    darkMode: false,
    theme: {
        extend: {
            colors: {
                primary: palette.primary,
                'pkm': palette.primary,
                'black-pkm': palette.black,
                'black-1-pkm': palette.black1,
                'gray-pkm': palette.gray,
                'gray-bg-pkm': palette['bg-gray'],
            },
            backgroundColor: {
                primary: palette.primary
            },
            width:{
                "347": "347px",
                "317": "317px"
            },
            padding:{
                "7": "30px"
            }
        }
    },
    variants: {
        extend: {
            borderStyle: ['important'],
            borderColor: ['important'],
            borderWidth: ['important'],
            borderRadius: ['important'],
            textColor: ['important'],
            height: ['important'],
            width: ['important'],
            backgroundColor: ['important'],
            padding: ['important'],
        }
    },
    plugins: [
        plugin(function({ addVariant }) {
            addVariant('important', ({ container }) => {
                container.walkRules(rule => {
                    rule.selector = `.\\!${rule.selector.slice(1)}`
                    rule.walkDecls(decl => {
                        decl.important = true
                    })
                })
            })
        })
    ]
}

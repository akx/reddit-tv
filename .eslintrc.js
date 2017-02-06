module.exports = {
  "extends": "airbnb",
  "plugins": [
    "react",
    "jsx-a11y",
    "import"
  ],
  "env": {
    "browser": true,
  },
  "rules": {
    "max-len": ["error", 120],
    "object-curly-spacing": [2, "never"],
    "no-continue": 0,
    "no-plusplus": 0,
    "react/sort-comp": 0,
    "comma-dangle": [
      "error", {
        "arrays": "always-multiline",
        "objects": "always-multiline",
        "imports": "always-multiline",
        "exports": "always-multiline",
        "functions": "ignore",
      }
    ],
  },
};

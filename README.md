# Obsidian Oral Exam Protocol Helper

This is a simple plugin that helps to count points and calculate a grade for protocols of the following form:

```markdown
- This is the first question? This is a partial answer that is right +, a partial answer that is wrong -, and now the last partial answer that is somewhat right +-
- What is the meaning of this and that? This is the right answer +
```

Which translates to a maximum number of 2 points (1 for each line of questions) and 1.5 actually archived points (2/4 points for the first line and 1/1 point for the second line). The points per line is defined by the fraction of `+` signs in relation to `+` and `-` signs.

The grade is calculated based on the percentage of archived points, ranging from at least 60% for 4.0 to at least 94% for grade 1.0. This is very much specific to the regulations of the educational institution the author of this plugin is employed at.

## How to use

- Clone this repo.
- `npm i` or `yarn` to install dependencies
- `npm run dev` to start compilation in watch mode.

## Manually installing the plugin

- Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/your-plugin-id/`.

## Improve code quality with eslint (optional)
- [ESLint](https://eslint.org/) is a tool that analyzes your code to quickly find problems. You can run ESLint against your plugin to find common bugs and ways to improve your code. 
- To use eslint with this project, make sure to install eslint from terminal:
  - `npm install -g eslint`
- To use eslint to analyze this project use this command:
  - `eslint main.ts`
  - eslint will then create a report with suggestions for code improvement by file and line number.
- If your source code is in a folder, such as `src`, you can use eslint with this command to analyze all files in that folder:
  - `eslint .\src\`

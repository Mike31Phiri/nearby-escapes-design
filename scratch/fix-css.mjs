import fs from 'fs';

const cssPath = 'src/styles.css';
let css = fs.readFileSync(cssPath, 'utf8');

// Replace `--var: oklch(A B C);` with `--var: A B C;`
css = css.replace(/--([a-z0-9-]+):\s*oklch\(([\d.\s]+)\);/g, '--$1: $2;');

// Replace `--var: oklch(A B C / X%);` with `--var: A B C / X%;`
css = css.replace(/--([a-z0-9-]+):\s*oklch\(([\d.\s\/%]+)\);/g, '--$1: $2;');

fs.writeFileSync(cssPath, css);

const twPath = 'tailwind.config.ts';
let tw = fs.readFileSync(twPath, 'utf8');

// Replace `"var(--var)"` with `"oklch(var(--var) / <alpha-value>)"` in the colors block
tw = tw.replace(/:\s*"var\(--([a-z0-9-]+)\)"/g, ': "oklch(var(--$1) / <alpha-value>)"');

fs.writeFileSync(twPath, tw);
console.log("Done fixing CSS and Tailwind config");

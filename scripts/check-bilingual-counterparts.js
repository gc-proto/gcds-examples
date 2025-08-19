#!/usr/bin/env node
/*
 Checks that for each template under templates/english and templates/french,
 a counterpart with the same relative path (ignoring extension) exists in the other language.
 Uses .bilingual-ignore.json to skip known intentional mismatches.
*/
const fs = require('fs');
const path = require('path');

const exts = ['.njk', '.html', '.liquid', '.md'];
const repoRoot = process.cwd();
const enRoot = path.join(repoRoot, 'templates', 'english');
const frRoot = path.join(repoRoot, 'templates', 'french');

function toPosix(p) { return p.split(path.sep).join('/'); }

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function loadIgnore() {
  const p = path.join(repoRoot, '.bilingual-ignore.json');
  if (!fs.existsSync(p)) return { ignore: [] };
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch (e) { return { ignore: [] }; }
}

function isIgnored(absPath, ignoreList) {
  const posixAbs = toPosix(absPath);
  return ignoreList.some((pattern) => {
    // exact match on posix absolute path or repo-relative path
    if (pattern.startsWith('templates/')) {
      return posixAbs.endsWith('/' + pattern.replace(/^templates\//, 'templates/'));
    }
    return posixAbs.endsWith(pattern);
  });
}

function stripLangRoot(absPath, langRoot) {
  const rel = path.relative(langRoot, absPath);
  return rel;
}

function withAnyExt(relNoExt) {
  return exts.map((ext) => relNoExt + ext);
}

function hasCounterpart(rel, targetRoot) {
  const relNoExt = rel.replace(/\.[^/.]+$/, '');
  for (const candidate of withAnyExt(relNoExt)) {
    const p = path.join(targetRoot, candidate);
    if (fs.existsSync(p)) return true;
  }
  return false;
}

function main() {
  const { ignore } = loadIgnore();
  const enFiles = walk(enRoot).filter(f => exts.includes(path.extname(f)));
  const frFiles = walk(frRoot).filter(f => exts.includes(path.extname(f)));

  const missingFr = [];
  for (const f of enFiles) {
    if (isIgnored(f, ignore)) continue;
    const rel = stripLangRoot(f, enRoot);
    if (!hasCounterpart(rel, frRoot)) missingFr.push('EN→FR missing: ' + toPosix('templates/french/' + rel.replace(/\.[^/.]+$/, '')));
  }

  const missingEn = [];
  for (const f of frFiles) {
    if (isIgnored(f, ignore)) continue;
    const rel = stripLangRoot(f, frRoot);
    if (!hasCounterpart(rel, enRoot)) missingEn.push('FR→EN missing: ' + toPosix('templates/english/' + rel.replace(/\.[^/.]+$/, '')));
  }

  if (missingFr.length || missingEn.length) {
    console.error('[bilingual-check] Missing counterparts found:');
    for (const m of missingFr) console.error(' - ' + m);
    for (const m of missingEn) console.error(' - ' + m);
    process.exit(1);
  }
  console.log('[bilingual-check] All good: counterparts present for checked files.');
}

main();

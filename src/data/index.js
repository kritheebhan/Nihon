import { D as n5Data } from './n5Data';
import { n4Data } from './n4Data';
import { D_NEW } from './newVocabData';

// Combine all data
export const D = { ...n5Data, ...n4Data, ...D_NEW };

// Section metadata (word counts)
export const META = {};
Object.keys(D).forEach(key => {
  META[key] = D[key].length;
});

// Get all section names
export const allSecs = Object.keys(D);
export const n5Secs = allSecs.filter(s => s.startsWith('N5'));
export const n4Secs = allSecs.filter(s => s.startsWith('N4'));

// Total word counts
export const totalWords = Object.values(D).reduce((sum, arr) => sum + arr.length, 0);
export const n5Total = n5Secs.reduce((sum, s) => sum + D[s].length, 0);
export const n4Total = n4Secs.reduce((sum, s) => sum + D[s].length, 0);

// Utility functions
export function displayName(sectionName) {
  return sectionName.replace(/^N[45]\s+/, '').replace(/^N4\s+/, '');
}

export function getLevel(sectionName) {
  return sectionName.startsWith('N5') ? 'N5' : 'N4';
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const PROGRESS_KEY='happiness-heist-progress-v1';
const EXP_KEY='happiness-heist-experiments-v1';
export function safeRead(key,fallback){try{const v=localStorage.getItem(key);return v?JSON.parse(v):fallback;}catch{return fallback;}}
export function safeWrite(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}}
export const loadProgress=()=>safeRead(PROGRESS_KEY,{unlocked:0,stats:null});
export const saveProgress=v=>safeWrite(PROGRESS_KEY,v);
export const resetProgress=()=>{try{localStorage.removeItem(PROGRESS_KEY);}catch{}};
export const loadExperiments=()=>safeRead(EXP_KEY,[]);
export const saveExperiments=v=>safeWrite(EXP_KEY,v);
export const clearExperiments=()=>{try{localStorage.removeItem(EXP_KEY);}catch{}};

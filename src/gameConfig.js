export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 600;
export const LEVELS = [
 {name:'Hostel Life',tag:'Find your rhythm',place:'HOSTEL CAMPUS',collect:'Rest, food & essentials',target:8,colors:[0x263c61,0x315d68],items:['🍲','📚','🌙','🪴','💧','🛏️'],obstacles:['🧹','🍟','📱'],enemy:'😴',tip:'Comfort helps — but rest, food and connection matter too.'},
 {name:'Academic Pressure',tag:'Learn without burning out',place:'ACADEMIC QUAD',collect:'Knowledge & planning',target:9,colors:[0x453d72,0x2f5875],items:['📖','📝','🎓','🗓️','💡','✏️'],obstacles:['📣','📱','⏰'],enemy:'👾',tip:'Consistent learning works better when energy is protected.'},
 {name:'Social Media & Comparison',tag:'Your path is your own',place:'CAMPUS & PARK',collect:'Friendship & confidence',target:9,colors:[0x285b64,0x3b755e],items:['💗','🤝','🌼','⭐','🫶','🌳'],obstacles:['🛍️','📸','💬'],enemy:'👻',tip:'Connection and self-acceptance can outweigh comparison.'},
 {name:'Placement Preparation',tag:'Grow with balance',place:'CAREER LAB',collect:'Skills & confidence',target:10,colors:[0x55446d,0x355b70],items:['💻','🎯','🗣️','🧠','🏅','🤝'],obstacles:['📉','⏳','📢'],enemy:'👾',tip:'Practice, mentoring and recovery are all part of preparation.'}
];
export const INITIAL = {sukh:50,suvidha:35,health:75,academic:40,energy:75,stress:25,relationships:55,money:500};
export const clamp=(v,min=0,max=100)=>Math.max(min,Math.min(max,v));

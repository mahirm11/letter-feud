import type { Category } from '../../shared/api';

export const todaysPuzzle: Category[] = [
    { id: "cat1", prompt: "Things you find in a garage", letter: "T" },
    { id: "cat2", prompt: "A movie", letter: "K" },
    { id: "cat3", prompt: "A cartoon character", letter: "P" },
    { id: "cat4", prompt: "A sport", letter: "H" },
    { id: "cat5", prompt: "A dessert", letter: "C"}
]

export const seedBoards: Record<string, Record<string, number>> = {
  cat1: { // Things you find in a garage, T
    tools: 50,
    tires: 35,
    toolbox: 25,
    tarp: 10,
    trampoline: 5,
  },
  cat2: { // A movie, K
    "king kong": 40,
    karate: 20,
    "kung fu panda": 15,
    knives: 10,
    "the karate kid": 8,
  },
  cat3: { // A cartoon character, P
    pikachu: 45,
    patrick: 30,
    "porky pig": 15,
    popeye: 12,
    "peter griffin": 10,
  },
  cat4: { // A sport, H
    hockey: 40,
    handball: 15,
    hurdles: 10,
    "horse racing": 8,
  },
  cat5: { // A dessert, C
    cake: 45,
    cookie: 35,
    cheesecake: 25,
    cannoli: 10,
    "creme brulee": 8,
  },
};
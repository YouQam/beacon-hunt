import { Task } from './task';

export class Game {
    constructor(
        public name: string,
        public tasks: Task[]
    ) { }
}
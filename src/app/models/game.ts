import { Task } from './task';

export class Game {
    constructor(
        public name: string,
        public useGPS: boolean,
        public tasks: Task[]
    ) { }
}
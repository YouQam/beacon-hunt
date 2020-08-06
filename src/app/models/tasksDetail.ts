export class TasksDetail {
    constructor(
        public taskID: Number,
        public targetDistance: Number,
        public reachedBeaconTime: String,
        public reachedGPSDistance: Number,
        public reachedGPSTime: String,
        public reachedBeaconDistance: Number,
        public GPSAccuracy: Number,
    ) { }
}
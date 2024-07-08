interface Activity {
  name: string;
  pool: string;
  swimlane: string;
  nodeId: string | undefined;
}

interface Activities {
  activities: Activity[];
}

interface Pools {
  pools: Pool[];
}

interface Swimlane {
  name: string;
  nodeId: string | undefined;
}

interface Pool {
  name: string;
  nodeId: string | undefined;
  swimlanes: Swimlane[];
}

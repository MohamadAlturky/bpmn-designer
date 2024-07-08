import apiUrl from "../configurations/apiConfiguration.json";
import axios from "axios";
import { useState, MouseEvent, useCallback, useEffect, ChangeEvent } from 'react';
import '@xyflow/react/dist/style.css'
import "../css/designer.css"

import {
    ReactFlow,
    addEdge,
    Node,
    Edge,
    ReactFlowInstance,
    Connection,
    MarkerType,
    useNodesState,
    useEdgesState,
    Controls,
    MiniMap,
    Background,
    Panel,
    useUpdateNodeInternals,
    ReactFlowProvider,
    useReactFlow,
} from '@xyflow/react';

import TitleNode from './TitleNode';
import swal from 'sweetalert';
import Swal from 'sweetalert2';

export type TitleNode = Node<
    { title: string; onChange: (event: ChangeEvent<HTMLInputElement>) => void },
    'title'
>;
const onNodeDrag = (_: MouseEvent, node: Node, nodes: Node[]) => console.log('drag', node, nodes);
const onNodeDragStop = (_: MouseEvent, node: Node, nodes: Node[]) => console.log('drag stop', node, nodes);

const onEdgeClick = (_: MouseEvent, edge: Edge) => console.log('click', edge);


// const defaultViewport = { x: 0, y: 0, zoom: 1.5 };
const initialNodes: Node[] = [];

const initialEdges: Edge[] = []
const nodeTypes = {
    title: TitleNode,
};
const SWINLANE_WIDTH = 800
const SWINLANE_HEIGHT = 300
// const POOL_HEIGHT = 100
// const POOL_WIDTH = 600
const POOL_WIDTH_PADDING = 100
const POOL_TITLE_WIDTH = 400
const POOL_TITLE_HEIGHT = 100
const SWINLANE_TITLE_WIDTH = 100
const SWINLANE_TITLE_HEIGHT = 100
const ACTIVITY_HEIGHT = 70
const ACTIVITY_WIDTH = 200

const Subflow = ({ poolsInput, processInput }: DesignerProps) => {
    const {
        fitView
    } = useReactFlow();
    //
    const [pools, setPools] = useState<Pools>(poolsInput)
    const [process,] = useState<string>(processInput)

    const onNodeClick = (_: MouseEvent, node: Node) => {
        if (node.data.type == "pool") {
            return;
        }
        else if (node.data.type == "poolTitle") {
            swal("what choose an operation on the " + node.data.title + "?", {
                buttons: {
                    remove: {
                        text: "Remove",
                        className: "warning"
                    },
                    edit: {
                        text: "Edit",
                        className: "edit"
                    },
                    addSwimlane: {
                        text: "Add Swimlane",
                    },
                },
            }).then((value) => {
                switch (value) {
                    case "addSwimlane":
                        swal({
                            text: 'Add Swimlane To The Pool' + node.data.title,
                            content: { element: "input" },
                            button: {
                                text: "Add",
                            },
                        }).then(name => {
                            if (!name) {
                                swal("No Action Applied!", "please fill the input section", "error");
                            }
                            else {
                                //

                                let poolsList: Pools = pools
                                poolsList.pools.forEach(pool => {
                                    if (pool.nodeId == node.id) {
                                        pool.swimlanes.push({
                                            name: name,
                                            nodeId: node.data.title + '\\' + name
                                        })
                                        // pool.name = name
                                        // pool.nodeId = "title" + '\\' + name
                                    }
                                })
                                // poolsList.pools.forEach(e => e.swimlanes.forEach(j => {
                                //     if (j.nodeId == node.id) {
                                //         j.name = name
                                //         j.nodeId = e.name + '\\' + name
                                //     }
                                // }))
                                let POOLS: Pools = {
                                    pools: poolsList.pools
                                }
                                console.log("POOLS", POOLS);

                                setPools(POOLS)

                                //

                                setTimeout(() => {
                                    swal("Greate!", "The Element Deleted Successfully😁", "success");
                                }, 100)
                            }

                            // return fetch(`https://itunes.apple.com/search?term=${name}&entity=movie`);
                        })
                        break;

                    case "edit":
                        swal({
                            text: 'Change the Component with name ' + node.data.title,
                            content: { element: "input" },
                            button: {
                                text: "Edit",
                            },
                        }).then(name => {
                            if (!name) {
                                swal("No Action Applied!", "please fill the input section", "error");
                            }
                            else {
                                //

                                let poolsList: Pools = pools
                                poolsList.pools.forEach(pool => {
                                    if (pool.nodeId == node.id) {
                                        pool.name = name
                                        pool.nodeId = "title" + '\\' + name
                                    }
                                })
                                poolsList.pools.forEach(e => e.swimlanes.forEach(j => {
                                    if (j.nodeId == node.id) {
                                        j.name = name
                                        j.nodeId = e.name + '\\' + name
                                    }
                                }))
                                let POOLS: Pools = {
                                    pools: poolsList.pools
                                }
                                console.log("POOLS", POOLS);

                                setPools(POOLS)

                                //

                                setTimeout(() => {
                                    swal("Greate!", "The Element Deleted Successfully😁", "success");
                                }, 100)
                            }

                            // return fetch(`https://itunes.apple.com/search?term=${name}&entity=movie`);
                        })
                        // swal("edit!", "Pikachu was caught!", "success");
                        break;

                    case "remove":

                        if (pools) {
                            console.log("removing node.id = ", node.id);

                            let newPools: Pool[] = pools.pools.filter(pool => pool.nodeId != node.id)
                            newPools.forEach(e => e.swimlanes = e.swimlanes.filter(x => x.nodeId != node.id))
                            let POOLS: Pools = {
                                pools: newPools
                            }
                            console.log("POOLS", POOLS);

                            setPools(POOLS)
                            setTimeout(() => {
                                swal("Greate!", "The Element Deleted Successfully😁", "success");
                            }, 100)
                        }
                        break;

                    default:
                        swal("UMM!", "No thing happend 😁", "info");
                }
            });
            console.log('click', node)
        }
        else if (node.data.type == "swimlane") {
            swal("what choose an operation on the " + node.data.title + "?", {
                buttons: {
                    remove: {
                        text: "Remove",
                        className: "warning"
                    },
                    edit: {
                        text: "Edit",
                        className: "edit"
                    }
                    // ,
                    // ChangePool: {
                    //     text: "Change Pool",
                    // },
                },
            }).then((value) => {
                switch (value) {
                    // case "Add Swimlane":
                    //     swal("Add Swimlane");
                    //     break;

                    case "edit":
                        swal({
                            text: 'Change the Component with name ' + node.data.title,
                            content: { element: "input" },
                            button: {
                                text: "Edit",
                            },
                        }).then(name => {
                            if (!name) {
                                swal("No Action Applied!", "please fill the input section", "error");
                            }
                            else {
                                //

                                let poolsList: Pools = pools
                                poolsList.pools.forEach(pool => {
                                    if (pool.nodeId == node.id) {
                                        pool.name = name
                                        pool.nodeId = "title" + '\\' + name
                                    }
                                })
                                poolsList.pools.forEach(e => e.swimlanes.forEach(j => {
                                    if (j.nodeId == node.id) {
                                        j.name = name
                                        j.nodeId = e.name + '\\' + name
                                    }
                                }))
                                let POOLS: Pools = {
                                    pools: poolsList.pools
                                }
                                console.log("POOLS", POOLS);

                                setPools(POOLS)

                                //

                                setTimeout(() => {
                                    swal("Greate!", "The Element Deleted Successfully😁", "success");
                                }, 100)
                            }

                            // return fetch(`https://itunes.apple.com/search?term=${name}&entity=movie`);
                        })
                        // swal("edit!", "Pikachu was caught!", "success");
                        break;

                    case "remove":

                        if (pools) {
                            console.log("removing node.id = ", node.id);

                            let newPools: Pool[] = pools.pools.filter(pool => pool.nodeId != node.id)
                            newPools.forEach(e => e.swimlanes = e.swimlanes.filter(x => x.nodeId != node.id))
                            let POOLS: Pools = {
                                pools: newPools
                            }
                            console.log("POOLS", POOLS);

                            setPools(POOLS)
                            setTimeout(() => {
                                swal("Greate!", "The Element Deleted Successfully😁", "success");
                            }, 100)
                        }
                        break;

                    default:
                        swal("UMM!", "No thing happend 😁", "info");
                }
            });
            console.log('click', node)
        }
    };


    function nodesFromPools(): Node[] {
        pools.pools.forEach(e => e.nodeId = "title" + '\\' + e.name)
        pools.pools.forEach(e => e.swimlanes.forEach(j => j.nodeId = e.name + '\\' + j.name))
        console.log("pools", pools)
        // const numberOfPools: number = pools.pools.length;
        let row = 1
        let col = 1
        let maxNumberOfSwimlanes = 0;
        var nodes = pools.pools.map((pool, index) => {
            const numberOfSwimlanes = pool.swimlanes.length;
            if (numberOfSwimlanes > maxNumberOfSwimlanes) {
                maxNumberOfSwimlanes = numberOfSwimlanes;
            }

            col = index % 3
            if (col == 2) {
                row++;
            }

            let height = numberOfSwimlanes * SWINLANE_HEIGHT
            if (height == 0) {
                height = POOL_TITLE_HEIGHT
            }
            const node: Node = {
                id: pool.name,
                data: { label: pool.name, type: "pool" },
                style: { width: SWINLANE_WIDTH + POOL_TITLE_WIDTH, height: height },
                position: { x: row * (SWINLANE_WIDTH + POOL_TITLE_WIDTH + POOL_WIDTH_PADDING), y: col * 1.6 * SWINLANE_HEIGHT * maxNumberOfSwimlanes },
                className: 'light',
                type: 'group',
                focusable: true
            }

            return node
        })
        //

        row = 1
        col = 1
        maxNumberOfSwimlanes = 0;
        pools.pools.map((pool, index) => {
            const numberOfSwimlanes = pool.swimlanes.length;
            if (numberOfSwimlanes > maxNumberOfSwimlanes) {
                maxNumberOfSwimlanes = numberOfSwimlanes;
            }

            col = index % 3
            if (col == 2) {
                row++;
            }
            let swimlaneNodes = pool.swimlanes.map((swimlane, inner_index) => {
                const node: Node = {
                    id: pool.name + '\\' + swimlane.name,
                    data: { title: swimlane.name, type: "swimlane" },
                    position: { x: POOL_TITLE_WIDTH, y: SWINLANE_HEIGHT * (inner_index) },
                    className: 'light',
                    parentId: pool.name,
                    extent: 'parent',
                    draggable: false,
                    style: {
                        width: SWINLANE_WIDTH,
                        height: SWINLANE_HEIGHT,
                        backgroundColor: 'rgba(50, 50, 255, 0.5)',
                    },
                    type: 'title',
                    // type: "title"
                }

                return node
            })
            const node: Node = {
                id: "title" + '\\' + pool.name,
                data: { title: pool.name, type: "poolTitle" },
                position: { x: 0, y: 0 },
                className: 'light',
                parentId: pool.name,
                extent: 'parent',
                draggable: false,
                style: {
                    width: POOL_TITLE_WIDTH,
                    height: POOL_TITLE_HEIGHT,
                    backgroundColor: 'rgba(0, 255, 0, 0.5)',
                },
                type: 'title',

                // type: "title"
            }
            nodes.push(node)
            for (let i = 0; i < swimlaneNodes.length; i++) {
                nodes.push(swimlaneNodes[i])
            }
            return
        })
        return nodes
    }
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    ///

    function nodesFromActivities(): Node[] {

        activities?.activities.forEach((e) => { e.nodeId = e.pool + '\\' + e.swimlane + '\\' + e.name })

        if (activities) {
            var nodes = activities?.activities.map((activity) => {

                let activityNodeId = activity.nodeId
                if (activityNodeId == undefined) {
                    activityNodeId = "Null"
                }
                const node: Node = {
                    id: activityNodeId,
                    data: { label: activity.name, type: "activity" },
                    style: { width: ACTIVITY_WIDTH, height: ACTIVITY_HEIGHT },
                    position: { x: 0, y: 0 },
                    className: 'light activity-content',
                    extent: 'parent',
                    parentId: activity.pool + '\\' + activity.swimlane
                }

                return node
            })
            //

            return nodes
        }
        else {
            throw new Error()
        }
    }
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    ///
    useEffect(() => {
        if (pools) {
            let nodes: Node[] = nodesFromPools()
            setNodes(nodes)
        }
    }, [pools])

    //
    const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
    const updateNodeInternals = useUpdateNodeInternals();

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback((connection: Connection) => setEdges((eds) => addEdge(connection, eds)), [setEdges]);
    const onInit = useCallback((reactFlowInstance: ReactFlowInstance) => {
        setRfInstance(reactFlowInstance)
    }, []);

    const updatePos = () => {
        setNodes((nds) => {
            return nds.map((n) => {
                if (!n.parentId) {
                    return {
                        ...n,
                        position: {
                            x: Math.random() * 400,
                            y: Math.random() * 400,
                        },
                    };
                }

                return n;
            });
        });
    };

    const logToObject = () => console.log(rfInstance?.toObject());
    const resetTransform = () => rfInstance?.setViewport({ x: 0, y: 0, zoom: 1 });

    const toggleClassnames = () => {
        setNodes((nds) => {
            return nds.map((n) => {
                return {
                    ...n,
                    className: n.className === 'light' ? 'dark' : 'light',
                };
            });
        });
    };

    const toggleChildNodes = () => {
        setNodes((nds) => {
            return nds.map((n) => {
                return {
                    ...n,
                    hidden: !!n.parentId && !n.hidden,
                };
            });
        });
    };

    const [activities, setActivities] = useState<Activities | undefined>()
    useEffect(() => {
        if (pools && activities) {
            let nodes: Node[] = nodesFromPools()
            console.log("nodesFromPools", nodes);

            let activitiesNodes: Node[] = nodesFromActivities()
            console.log("activitiesNodes", activitiesNodes);

            for (let i = 0; i < activitiesNodes.length; i++) {
                nodes.push(activitiesNodes[i])
            }
            setNodes(nodes)
        }
    }, [activities])
    const handleSubmitPools = () => {
        swal({
            text: 'Let\'s ask the ai to generate the activities',
            // content: "input",
            button: {
                text: "Search!",
                closeModal: false,
            },
        })
            .then(() => {
                const data = {
                    process_description: process,
                    pools_and_swimlanes: pools
                }
                const axiosInstance = axios.create();
                axiosInstance.post<Activities>(apiUrl.baseUrl + "/activities/extract_from_pools_and_swimlanes", data)
                    .then(res => {
                        // setPools(res.data)
                        console.log(res.data);
                        // console.log(pools);

                        setActivities(res.data)
                        console.log(activities);
                        swal.stopLoading();
                        swal.close();
                        setTimeout(() => {
                            fitView({ duration: 1200, padding: 0.3 })
                        }, 100);
                    }).catch(err => console.log(err));

                // return fetch(`https://itunes.apple.com/search?term=${name}&entity=movie`);
            })
        // .then(results => {
        //     return results.json();
        // })
        // .then(json => {
        //     const movie = json.results[0];

        //     if (!movie) {
        //         return swal("No movie was found!");
        //     }

        //     const name = movie.trackName;
        //     const imageURL = movie.artworkUrl100;

        //     swal({
        //         title: "Top result:",
        //         text: name,
        //         icon: imageURL,
        //     });
        // })
        // .catch(err => {
        //     if (err) {
        //         swal("Oh noes!", "The AJAX request failed!", "error");
        //     } else {
        //         swal.stopLoading();
        //         swal.close();
        //     }
        // });




































    }
    return (
        <>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onInit={onInit}
                onNodesChange={(changes) => {
                    onNodesChange(changes)
                    // fitView({ duration: 1200, padding: 0.3 })
                }}
                onEdgesChange={onEdgesChange}
                // onNodeClick={onNodeClick}
                onNodeDoubleClick={onNodeClick}
                onEdgeClick={onEdgeClick}
                onConnect={onConnect}
                onNodeDrag={onNodeDrag}
                onNodeDragStop={onNodeDragStop}
                className="react-flow-basic-example"
                onlyRenderVisibleElements={false}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ duration: 1200, padding: 0.2 }}
                nodeOrigin={[0, 0]}
                maxZoom={Infinity}
                zoomOnDoubleClick={false}
            >
                <MiniMap />
                <Controls />
                <Background />
                <Panel position="top-right">
                    {!activities && (
                        <>
                            <div className="swal-button-container panel-font" onClick={() => { handleSubmitPools() }}>
                                <button className="swal-button swal-button panel-font">Generate Activities</button>
                            </div>

                        </>

                    )}
                    <div className="swal-button-container panel-font" onClick={() => fitView({ duration: 1200, padding: 0.3 })}>
                        <button className="swal-button swal-button panel-font">Fit View</button>
                    </div>
                </Panel>
                {/* <Panel position="top-right">
                    <button onClick={() => fitView({ duration: 1200, padding: 0.3 })}>fitView</button>
                    <button onClick={resetTransform}>reset transform</button>
                    <button onClick={updatePos}>change pos</button>
                    <button onClick={toggleClassnames}>toggle classnames</button>
                    <button onClick={toggleChildNodes}>toggleChildNodes</button>
                    <button onClick={logToObject}>toObject</button>
                    <button onClick={() => setNodes(initialNodes)}>setNodes</button>
                    <button onClick={() => updateNodeInternals(nodes.map((node) => node.id))}>updateNodeInternals</button>
                </Panel> */}
            </ReactFlow >
        </>
    );
};

interface DesignerProps {
    poolsInput: Pools
    processInput: string
}
export default (props: DesignerProps) => (
    <ReactFlowProvider>
        <Subflow poolsInput={props.poolsInput} processInput={props.processInput} />
    </ReactFlowProvider>
);

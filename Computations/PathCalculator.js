/**
 * PathFinder - Shortest Path in a City Graph
 * ------------------------------------------
 * This function finds the shortest path between two locations (nodes) in a city.
 * 
 * How the graph is represented:
 * - Each "MidPoint" is a node (vertex) in the graph (e.g., a delivery hub or intersection).
 * - Each "DistanceEdge" is an edge (connection) between two nodes, with a distance (weight).
 * 
 * Example:
 * Suppose we have three midpoints (nodes):
 *   A (id: 1), B (id: 2), C (id: 3)
 * And distance edges:
 *   A <-> B (distance: 5)
 *   B <-> C (distance: 7)
 *   A <-> C (distance: 15)
 * 
 * If you want the shortest path from A to C, the algorithm will find:
 *   A -> B -> C (total distance: 5 + 7 = 12), which is shorter than A -> C directly (distance: 15)
 * 
 * Algorithm steps:
 * 1. Initialize all node distances to infinity (a large number), except the source node (set to 0).
 * 2. For each edge, update the shortest known distance to each connected node (relaxation step).
 * 3. Track the parent of each node to reconstruct the shortest path at the end.
 * 4. Return the path as an array of node IDs from source to destination.
 * 
 * Data Structures Used:
 * - Map: To store the minimum distance to each node and to reconstruct the path.
 * - Array: To build and return the path.
 * 
 * This is similar to Dijkstra's algorithm for finding the shortest path in a weighted graph.
 */




import MidPointSchema from "../Models/MidPoints.js"
import { findDistance } from "./calDistance.js";
import DistanceEdgeSchema from "../Models/DistanceEdge.js";

export const PathFinder = async (source, destination, city) => {
    const map = new Map();
    await MidPointSchema.find({ city: city }).then((result) => {
        for (var j = 0; j < result.length; j++) {
            var idd = result[j]._id.toString();
            map.set(idd, 1000000000);
        }
    })
    var idd = source.toString();
    map.set(idd, 0);
    const parent = new Map();
    await DistanceEdgeSchema.find({ City: city }).then((result) => {
        // console.log(result);
        for (var j = 0; j < result.length; j++) {
            for (var k = 0; k < result.length; k++) {
                var dist = result[k].Distance;
                var firstPoint = result[k].FirstPoint.toString();
                var secondPoint = result[k].SecondPoint.toString();
                var valueAtFirst = map.get(firstPoint);
                var valueAtSecond = map.get(secondPoint);
                if (valueAtFirst + dist < valueAtSecond) {
                    parent.set(secondPoint, firstPoint);
                    map.set(secondPoint, valueAtFirst + dist);
                }
            }
        }
    })
    console.log(source + ":::" + destination);
    console.log(map);
    console.log(parent);
    var res = [];
    source = source.toString();
    destination = destination.toString();
    while (destination != source && destination != undefined) {
        //console.log(destination);
        res.push(destination);
        destination = parent.get(destination);
        //console.log("dest" + destination);
    }
    res.push(source);
    console.log(res);
    return res;
}




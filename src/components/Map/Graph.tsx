

import Graph, { } from 'graphology';
import { LatLngLiteral } from "leaflet";

interface Node extends LatLngLiteral {
  key: string
}


export const graph = new Graph<LatLngLiteral>()


export const CreateAdjacentMatrix = (graph: Graph): Promise<Array<Array<number>>> => {
  return new Promise((resolve, reject) => {
    const adjacencyMatrix = new Array<Array<number>>()
    if (graph.nodes().length === 0) return reject("no nodes in graph")
    if (graph.nodes().length === 1) return reject("no edges in graph")

    graph.nodes().forEach((val2) => {
      const nodes = new Array<number>()
      graph.nodes().forEach((val1) => {
        nodes.push(0)
      })
      adjacencyMatrix.push(nodes)
    })

    graph.forEachEdge(
      (_, attributes, source, target) => {
        adjacencyMatrix[Number(source)][Number(target)] = attributes.weight
        adjacencyMatrix[Number(target)][Number(source)] = attributes.weight
      });


    return resolve(adjacencyMatrix)
  })
}

export const calcDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  var R = 6371e3;
  var dLat = toRad(lat2 - lat1);
  var dLon = toRad(lon2 - lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}


const toRad = (Value: number): number => {
  return Value * Math.PI / 180;
}


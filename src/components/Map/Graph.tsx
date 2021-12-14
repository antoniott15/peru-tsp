

import internal from 'events';
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

const minKey = (numVertex: number, key: Array<number>, mstSet: Array<unknown>): number => {
  let min = Number.MAX_VALUE, min_index;

  for (let v = 0; v < numVertex; v++) {
    if (mstSet[v] === false && key[v] < min) {
      min = key[v]
      min_index = v;
    }
  }

  return min_index || 0;
}


export interface DrawLines {
  from: string,
  to: string
}

export const PrimMST = (graph: Array<Array<number>>): [Map<number, Array<number>>, number] => {
  const parent = new Array<number>()
  const key = new Array<number>()
  const set = new Array<unknown>()
  const numVertex = graph.length

  for (let i = 0; i < numVertex; i++) {
    key.push(Number.MAX_VALUE)
    set.push(false)
  }

  key[0] = 0;
  parent.push(-1)

  for (let count = 0; count < numVertex - 1; count++) {
    const u = minKey(numVertex, key, set);
    set[u] = true;

    for (let v = 0; v < numVertex; v++) {
      if (graph[u][v] && set[v] === false && graph[u][v] < key[v]) {
        parent[v] = u
        key[v] = graph[u][v]
      }
    }
  }

  const adj = new Map<number, Array<number>>()

  for (let i = 1; i < numVertex; i++) {

    const res = adj.has(parent[i])

    if (res) {
      const node = adj.get(parent[i])
      if (node) {
        node?.push(i)
        adj.set(parent[i], node)
      }

    } else {
      const l = new Array<number>()
      l.push(i)
      adj.set(parent[i], l)
    }

    console.log(`from: ${parent[i]} to ${i} with weight ${graph[i][parent[i]]}`)
  }


  return [adj, numVertex - 1]
}



export const DFS = (adjacencyList: Map<number, Array<number>>, len: number): Array<number> => {
  const visited = new Array<boolean>(len)
  for (let i = 0; i < len; i++) {
    visited[i] = false
  }

  const path = new Array<number>()

  const util = (init: number, visited: Array<boolean>) => {
    visited[init] = true
    path.push(init)

    if (adjacencyList.has(init)) {
      const v = adjacencyList.get(init)
      if (v) {
        //@ts-ignore
        for (let i of v.values()) {
          let n = i
          if (!visited[n]) {
            util(n, visited)
          }
        }


      }
    }

  }

  util(0,visited)

  path.push(path[0])
  return path
}

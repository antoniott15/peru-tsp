import React, { useEffect, useState } from "react";
import { LatLng, LatLngExpression } from "leaflet";
import { Marker, useMapEvents, Polyline } from "react-leaflet";
import { connect } from "react-redux";
import {
  setPlaceFormVisibility,
  setPrePlaceLocation,
} from "../../store/actions";

import { graph, calcHaversineDistance, CreateAdjacentMatrix, PrimMST, DFS } from "./Graph"
interface MapMode {
  distances: boolean,
  cpu: boolean
}

const AddMarker = (props: MapMode) => {
  const [lineCpu, setLinesCpu] = useState<Array<[number, number]>>([[-9.189967, -75.015152]])
  const [positions, setPositions] = useState<Array<LatLngExpression | null>>([])
  const [lineDistance, setLinesDistance] = useState<Array<[number, number]>>([[-9.189967, -75.015152]])
  const [ran,setRandom ] = useState<Array<number>>([12312])

  useEffect(() => {
    const lines = new Array<[number, number]>() 
 
    if (props.distances && positions) {  
      graph.forEachNode((node1, i) => {  
        graph.forEachNode((node2, j) => {
          if (node1 !== node2 && Number(node1) > Number(node2)) {   
            try {   
              graph.addEdge(node1, node2, {
                weight: calcHaversineDistance(i.lat, i.lng, j.lat, j.lng)
              })
            }catch(e) {
              const ed = graph.edge(node1, node2)
              graph.updateEdgeAttribute(ed, "weight", ()=>{
                return calcHaversineDistance(i.lat, i.lng, j.lat, j.lng)
              })
            }
          }
        })
      })
    }else if(props.cpu && positions){
      graph.forEachNode((node1, i) => {
        graph.forEachNode((node2, j) => {
          if (node1 !== node2 && Number(node1) > Number(node2)) {
            try {
              graph.addEdge(node1, node2, {
                weight: calcHaversineDistance(i.lat, i.lng, j.lat, j.lng) + ran[Number(node1)]
              })
            }catch(e) {
              const ed = graph.edge(node1, node2)
              graph.updateEdgeAttribute(ed, "weight", ()=>{
                return calcHaversineDistance(i.lat, i.lng, j.lat, j.lng) + ran[Number(node1)]
              })
            }
          }
        })
      })
    }else {
      console.log("returning");
      return;
    }

    (async () => {
      try {
        const adjacency = await CreateAdjacentMatrix(graph)

        const [prim, len] =  PrimMST(adjacency)

        const path = DFS(prim, len)

        path.forEach((val) => {
          const  point  = graph.getNodeAttributes(val)
          lines.push([point.lat, point.lng])
        })

      }catch(err) {
        console.log(err)
      }
    })()



    if(props.distances){
      setLinesDistance(lines)
    }else if(props.cpu) {
      setLinesCpu(lines)
    }


  }, [props, positions])

  useMapEvents({
    click: (e) => {
      graph.addNode(positions.length.toString(), { lat: e.latlng.lat, lng: e.latlng.lng })
      setPositions([...positions, e.latlng])
      setRandom([...ran, ( Math.floor(Math.random() * (184850 - 10 + 1) + 10))])
    },
  });

  return positions.length <= 1 ? null : (
    <>
      {props.cpu ? <Polyline positions={lineCpu} /> : props.distances  ? <Polyline positions={lineDistance} /> : null}

      {positions ? positions.map((pos, i) => {
        //@ts-ignore
        return <Marker key={i} position={pos} > </Marker>
      }) : null}
    </>
  );
};

const mapStateToProps = (state: any) => {
  const { places } = state;

  return {
    formIsOpen: places.placeFormIsVisible,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    toggleForm: (payload: boolean) => dispatch(setPlaceFormVisibility(payload)),
    setLocation: (payload: LatLng) => dispatch(setPrePlaceLocation(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddMarker);

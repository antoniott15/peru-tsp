import React, { useEffect, useState } from "react";
import { LatLng, LatLngExpression } from "leaflet";
import { Marker, useMapEvents, Polyline } from "react-leaflet";
import { connect } from "react-redux";
import {
  setPlaceFormVisibility,
  setPrePlaceLocation,
} from "../../store/actions";

import { graph, calcDistance, CreateAdjacentMatrix, PrimMST, DrawLines } from "./Graph"
interface MapMode {
  distances: boolean,
  cpu: boolean
}

const AddMarker = (props: MapMode) => {
  const [line, setLines] = useState<Array<[number, number]>>([[-9.189967, -75.015152]])
  const [positions, setPositions] = useState<Array<LatLngExpression | null>>([])


  useEffect(() => {
    const lines = new Array<[number, number]>()
    if (props.cpu && positions) {
      //@ts-ignore
      // positions.forEach((value: LatLngExpression, i: number) => {
      //   const ltng = value as LatLng
      //   lines.push([ltng.lat, ltng.lng])
      // })


      graph.forEachNode((node1, i) => {
        graph.forEachNode((node2, j) => {
          if (node1 !== node2 && Number(node1) > Number(node2)) {
            graph.addEdge(node1, node2, {
              weight: calcDistance(i.lat, i.lng, j.lat, j.lng)
            })
          }
        })
      })
    }

    (async () => {
      try {
        const adjacency = await CreateAdjacentMatrix(graph)

        const prim =  PrimMST(adjacency)

      }catch(err) {
        console.log(err)
      }
    })()



    setLines(lines)
  }, [props, positions])

  useMapEvents({
    click: (e) => {
      graph.addNode(positions.length.toString(), { lat: e.latlng.lat, lng: e.latlng.lng })
      setPositions([...positions, e.latlng])
    },
  });

  return positions.length <= 1 ? null : (
    <>
      {props.cpu || props.distances ? <Polyline positions={line} /> : null}
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

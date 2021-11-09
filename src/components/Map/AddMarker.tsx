import React, { useEffect, useState } from "react";
import { LatLng, LatLngExpression } from "leaflet";
import { Marker,  useMapEvents, Polyline } from "react-leaflet";
import { connect } from "react-redux";
import {
  setPlaceFormVisibility,
  setPrePlaceLocation,
} from "../../store/actions";

interface MapMode {
  distances: boolean,
  cpu: boolean
}

const AddMarker = (props: MapMode) => {
  const [line, setLines] = useState<Array<[number, number]>>([[-9.189967, -75.015152]])
  const [positions, setPositions] = useState([
    { lat: -9.189967, lng: -75.015152 } as LatLngExpression,
  ])


  useEffect(() => {
    const lines = new Array<[number, number]>()
    if (props.cpu) {
      positions.forEach((value: LatLngExpression) => {
        const ltng = value as LatLng
        lines.push([ltng.lat, ltng.lng])
      })
    }
    if (props.distances) {
      positions.forEach((value: LatLngExpression) => {
        console.log(value)
      })
    }
    setLines(lines)
  }, [props])

  useMapEvents({
    click: (e) => {
      setPositions([...positions, e.latlng])
    },
  });

  return positions.length <= 1 ? null : (
    <>
      {props.cpu || props.distances ? <Polyline positions={line} /> : null}
      {positions.map((pos, i) => {
        return <Marker key={i} position={pos} > </Marker>
      })}
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

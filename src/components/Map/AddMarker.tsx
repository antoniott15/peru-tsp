import React, { useEffect, useState } from "react";
import { LatLng, LatLngExpression } from "leaflet";
import { Marker, Tooltip, useMapEvents } from "react-leaflet";
import { connect } from "react-redux";
import {
  setPlaceFormVisibility,
  setPrePlaceLocation,
} from "../../store/actions";
import { IState } from "../../store/models";

const AddMarker = ({ setLocation }: any) => {
  const [positions, setPositions] = useState([
    {lat: -9.189967, lng: -75.015152} as LatLngExpression,
    {lat: -9.183967, lng: -75.015452} as LatLngExpression,
  ])

  useMapEvents({
    click: (e) => {
      setLocation(e.latlng);
      setPositions([...positions, e.latlng])
    },
  });

  return positions.length <= 1  ? null : (
    <>
      {positions.map((pos,i) => {
        return <Marker key={i}  position={pos} > </Marker>
      })}
    </>
  );
};

const mapStateToProps = (state: IState) => {
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

export default connect(mapStateToProps,mapDispatchToProps)(AddMarker);

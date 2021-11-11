import React  from "react";
import { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import { connect } from "react-redux";
import { setPlacePreviewVisibility } from "../../store/actions";
import AddMarker from "./AddMarker";

import "./Map.css";

interface MapMode {
  distances: boolean,
  cpu: boolean
}

const Map = (props: MapMode) => {
  const defaultPosition: LatLngExpression = [-9.189967, -75.015152];


  return (
    <div className="map__container">
      <MapContainer
        center={defaultPosition}
        zoom={6}

        scrollWheelZoom={false}
        style={{ height: "100vh" }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AddMarker distances={props.distances} cpu={props.cpu} />
      </MapContainer>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  const { places } = state;
  return {
    isVisible: places.placePreviewsIsVisible,
    places: places.places,
    selectedPlace: places.selectedPlace,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    togglePreview: (payload: boolean) =>
      dispatch(setPlacePreviewVisibility(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Map);

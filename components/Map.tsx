import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

import { icons } from "@/constants";
import { useFetch } from "@/lib/fetch";
import {
  calculateDriverTimes,
  calculateRegion,
  generateMarkersFromData,
} from "@/lib/map";
import { useDriverStore, useLocationStore } from "@/store";
import { Driver, MapProps, MarkerData } from "@/types/type";

const directionsAPI = process.env.EXPO_PUBLIC_DIRECTIONS_API_KEY;

const Map = ({ currentLocation }: MapProps) => {
  // If currentLocation is provided, use that instead of the store
  const {
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude,
  } = useLocationStore();

  const effectiveLocation = currentLocation
    ? {
        userLatitude: currentLocation.latitude,
        userLongitude: currentLocation.longitude,
      }
    : {
        userLatitude,
        userLongitude,
      };

  const { selectedDriver, setDrivers } = useDriverStore();
  const { data: drivers, loading, error } = useFetch<Driver[]>("/(api)/driver");
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  // Only fetch and process drivers data if we're not in simple mode (no currentLocation provided)
  useEffect(() => {
    if (!currentLocation && Array.isArray(drivers)) {
      if (!effectiveLocation.userLatitude || !effectiveLocation.userLongitude)
        return;
      const newMarkers = generateMarkersFromData({
        data: drivers,
        userLatitude: effectiveLocation.userLatitude,
        userLongitude: effectiveLocation.userLongitude,
      });
      setMarkers(newMarkers);
    }
  }, [
    drivers,
    effectiveLocation.userLatitude,
    effectiveLocation.userLongitude,
    currentLocation,
  ]);

  useEffect(() => {
    if (
      !currentLocation &&
      markers.length > 0 &&
      destinationLatitude !== undefined &&
      destinationLongitude !== undefined
    ) {
      calculateDriverTimes({
        markers,
        userLatitude: effectiveLocation.userLatitude,
        userLongitude: effectiveLocation.userLongitude,
        destinationLatitude,
        destinationLongitude,
      }).then((drivers) => {
        setDrivers(drivers as MarkerData[]);
      });
    }
  }, [markers, destinationLatitude, destinationLongitude, currentLocation]);

  const region = calculateRegion({
    userLatitude: effectiveLocation.userLatitude,
    userLongitude: effectiveLocation.userLongitude,
    destinationLatitude,
    destinationLongitude,
  });

  // Only show loading indicator if we're waiting for location data
  if (!effectiveLocation.userLatitude || !effectiveLocation.userLongitude)
    return (
      <View className="flex justify-between items-center w-full">
        <ActivityIndicator size="small" color="#000" />
      </View>
    );

  if (error && !currentLocation)
    return (
      <View className="flex justify-between items-center w-full">
        <Text>Error: {error}</Text>
      </View>
    );

  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      className="w-full h-full rounded-2xl"
      tintColor="black"
      mapType="mutedStandard"
      showsPointsOfInterest={false}
      initialRegion={region}
      showsUserLocation={true}
      userInterfaceStyle="light"
    >
      {!currentLocation &&
        markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            image={
              selectedDriver === +marker.id
                ? icons.selectedMarker
                : icons.marker
            }
          />
        ))}

      {destinationLatitude && destinationLongitude && (
        <>
          <Marker
            key="destination"
            coordinate={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
            title="Destination"
            image={icons.pin}
          />
          <MapViewDirections
            origin={{
              latitude: effectiveLocation.userLatitude!,
              longitude: effectiveLocation.userLongitude!,
            }}
            destination={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
            apikey={directionsAPI!}
            strokeColor="#0286FF"
            strokeWidth={2}
          />
        </>
      )}
    </MapView>
  );
};

export default Map;

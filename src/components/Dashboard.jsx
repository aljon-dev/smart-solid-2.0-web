import React, { useEffect, useReducer, useState } from "react";
import TrackerMap from "./TrackerMap";
import { rdb } from "../../firebase";
import {
  onValue,
  ref,
  onChildAdded,
  update,
  onChildRemoved,
  get,
} from "firebase/database";
import "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";
import "leaflet-routing-machine";

import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import { SimpleMapScreenshoter } from "leaflet-simple-map-screenshoter";
import PopupDialog from "./PopupDialog";
import { show } from "../states/alerts";
import { useDispatch } from "react-redux";

const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

const iconRed = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

function Dashboard() {
  const [map, setMap] = useState(null);
  const [route, setRoute] = useState(null);
  const [marker, setMarker] = useState([]);
  const [screenshotter, setScreenshotter] = useState(null);
  const [onReset, setReset] = useState(false);
  const [isOpenEmptyNotif, setOpenEmptyNotif] = useState(false);
  const [isOpenNotif, setOpenNotif] = useState(false);

  const dispatch = useDispatch();

  const collectionPoints = [
    { lat: 8.0106, lon: 125.1606 },
    { lat: 7.995, lon: 139.3167 },
    { lat: 8.0392, lon: 125.2367 },
    { lat: 11.65, lon: 148.7833 },
    { lat: 11.6833, lon: 140.2333 },
    { lat: 8.0386, lon: 125.1694 },
    { lat: 9.35, lon: 137.25 },
    { lat: 8.1614, lon: 125.1242 },
    { lat: 8.1636, lon: 125.1161 },
    { lat: 8.1636, lon: 125.1214 },
    { lat: 8.1611, lon: 125.1206 },
    { lat: 8.1442, lon: 125.1256 },
    { lat: 8.1439, lon: 125.1233 },
    { lat: 8.1436, lon: 125.1211 },
  ];

  const [trucks, setTrucks] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      fetchState: 0,
      trucks: [],
      count: 0,
    }
  );

  // useEffect(() => {
  //   if (!map) return;
  // }, []);

  const snapshotOptions = {
    hideElementsWithSelectors: [
      ".leaflet-control-container",
      "#snapshot-button",
    ],
    hidden: true,
  };

  const trackGarbageTruck = () => {
    if (trucks["fetchState"] == 1) {
      setOpenEmptyNotif(false);
      setOpenNotif(true);

      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      timer = setTimeout(() => {
        setOpenNotif(false);
      }, 5000);

      const truck = trucks["trucks"][0];

      if (route) {
        map.removeControl(route);
        setRoute(null);
      }

      if (marker.length > 0) {
        marker.map((item) => {
          map.removeLayer(item);
        });

        setMarker([]);
      }

      if (truck.current.length < 1) {
        return;
      }

      try {
        const current = truck.current[truck.current.length - 1]
          .split(",")
          .map((i) => parseFloat(i.trim()));
        var points = [];

        truck.current.map((item) => {
          const latlng = item.split(",").map((i) => i.trim());

          if (latlng.length != 2) return;

          const reg = new RegExp(
            "^-?([0-9]{1,2}|1[0-7][0-9]|180)(.[0-9]{1,10})$"
          );

          if (reg.exec(latlng[0]) && reg.exec(latlng[1])) {
            points.push([
              parseFloat(latlng[0].trim()),
              parseFloat(latlng[1].trim()),
            ]);
          }

          if (points.length > 0) {
            let currentPoint = points[0];
            points = points.filter((p) => {
              if (getDistance(currentPoint, p) <= 500) {
                currentPoint = p;
                return true;
              }

              return false;
            });
          }

          // points.push(item.split(",").map((i) => parseFloat(i.trim())));
        });

        map.flyTo(current, 17);

        const temp = L.polyline(points, {
          color: "red",
          weight: 5,
          opacity: 0.6,
          smoothFactor: 1,
        });

        const tempM = [points[points.length - 1]].map((item) => {
          const marker = L.marker(item, { icon: iconRed }).addTo(map);

          marker.bindTooltip("Truck 1", {
            permanent: true,
            direction: "top",
            offset: L.point(-15, -15),
          });
          return marker;
        });

        //  tempM2 = [points[0]].map((item) => {
        //     const marker = L.marker(item, { icon: iconRed }).addTo(map);

        //     // marker.bindTooltip("Truck 1 - Start", {
        //     //   permanent: true,
        //     //   direction: "top",
        //     //   offset: L.point(-15, -15),
        //     // });

        //     return marker;
        //   });

        let tempM2 = collectionPoints.map((item, index) => {
          const marker = L.marker(item, { icon: iconDefault }).addTo(map);

          marker.bindTooltip(`Collection Point - ${index + 1}`, {
            permanent: true,
            direction: "top",
            offset: L.point(-15, -15),
          });

          return marker;
        });

        temp.addTo(map);
        setMarker([...tempM, ...tempM2]);
        //setMarker(tempM2);

        setRoute(temp);
      } catch (err) {
        console.log(err);
        return;
      }

      setScreenshotter(L.simpleMapScreenshoter(snapshotOptions).addTo(map));
    } else {
      setOpenNotif(false);
      setOpenEmptyNotif(true);

      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      timer = setTimeout(() => {
        setOpenEmptyNotif(false);
      }, 5000);
    }
  };

  useEffect(() => {
    if (!map) return;
    trackGarbageTruck();
  }, [trucks["trucks"]]);

  useEffect(() => {
    const query = ref(rdb, "/NODES");

    get(query).then((snapshot) => {
      const data = snapshot.val();

      if (snapshot.exists()) {
        const trucks = Object.keys(data).map((key) => data[key]);

        if (!("current" in trucks[0])) {
          setTrucks({
            fetchState: 2,
            trucks: [],
          });

          setOpenEmptyNotif(true);

          if (timer) {
            clearTimeout(timer);
            timer = null;
          }

          timer = setTimeout(() => {
            setOpenEmptyNotif(false);
          }, 5000);

          return;
        }

        setOpenEmptyNotif(false);
        setTrucks({
          fetchState: 1,
          trucks: trucks,
        });

        return;
      }

      setTrucks({
        fetchState: 2,
      });
    });
  }, []);

  var timer = null;

  useEffect(() => {
    const query = ref(rdb, "/NODES");

    return onValue(query, (snapshot) => {
      const data = snapshot.val();

      if (!data) return;

      if (snapshot.exists()) {
        const trucks = Object.keys(data).map((key) => data[key]);

        if (!("current" in trucks[0])) {
          setTrucks({
            fetchState: 2,
            trucks: [],
          });

          setOpenNotif(false);
          setOpenEmptyNotif(true);

          if (timer) {
            clearTimeout(timer);
            timer = null;
          }

          timer = setTimeout(() => {
            setOpenEmptyNotif(false);
          }, 5000);

          return;
        }

        setOpenEmptyNotif(false);
        setOpenNotif(true);

        if (timer) {
          clearTimeout(timer);
          timer = null;
        }

        timer = setTimeout(() => {
          setOpenNotif(false);
        }, 5000);

        setTrucks({
          fetchState: 1,
          trucks: trucks,
        });

        return;
      }

      setTrucks({
        fetchState: 2,
      });
    });
  }, []);

  useEffect(() => {
    const query = ref(rdb, "/NODES/Truck-01");

    onChildRemoved(query, (snapshot) => {
      setTrucks({
        fetchState: 2,
        trucks: [],
      });
    });
  }, []);

  function getDistance(currentPoint, point) {
    const R = 6371e3;
    const p1 = (currentPoint[0] * Math.PI) / 180;
    const p2 = (point[0] * Math.PI) / 180;
    const deltaLon = point[1] - currentPoint[1];
    const deltaLambda = (deltaLon * Math.PI) / 180;
    const d =
      Math.acos(
        Math.sin(p1) * Math.sin(p2) +
          Math.cos(p1) * Math.cos(p2) * Math.cos(deltaLambda)
      ) * R;
    return d;
  }

  const handleReset = () => {
    const truckRef = ref(rdb, "/NODES/Truck-01");

    update(truckRef, { initial: [], current: [] })
      .then((val) => {
        dispatch(
          show({
            type: "success",
            message: "The garbage truck map has been reset.",
            duration: 3000,
            show: true,
          })
        );

        if (route) {
          map.removeControl(route);
          setRoute(null);
        }

        if (marker.length > 0) {
          marker.map((item) => {
            map.removeLayer(item);
          });

          setMarker([]);
        }

        map.flyTo([8.054375, 125.195331], 14);
      })
      .catch((err) => {
        show({
          type: "error",
          message: "Something went wrong.",
          duration: 3000,
          show: true,
        });
      });
  };

  return (
    <div className="w-full h-full rounded-lg">
      <TrackerMap
        map={map}
        setMap={setMap}
        trucks={trucks}
        track={() => {
          trackGarbageTruck();
        }}
        screenshotter={screenshotter}
        onReset={() => {
          setReset(true);
        }}
        isOpenEmptyNotif={isOpenEmptyNotif}
        isOpenNotif={isOpenNotif}
      />
      <PopupDialog
        show={onReset}
        close={() => {
          setReset(false);
        }}
        title="Reset Tracker"
        content="Are you sure you want to reset tracker?"
        action1={() => {
          handleReset();
          setReset(false);
        }}
        action2={() => {
          setReset(false);
        }}
      />
    </div>
  );
}

export default Dashboard;

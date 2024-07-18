import { Component, createRef, useRef } from "react";
import Map2 from "./Map2";

interface IMapViewProps {
  zoomLevel: number;
  tileUrl: string;
}

interface IMapViewState {
  center: {
    lat: number;
    lng: number;
  };
}

export default class MapView2 extends Component<IMapViewProps, IMapViewState> {
  constructor(props: IMapViewProps) {
    super(props);
    this.state = {
      center: {
        lat: 0,
        lng: 0
      }
    };
    (window as any).setLatitude2 = (val: number) => {
      console.log("MapView2.setLatitude2", val);
      this.setState({ center: { lat: val, lng: this.state.center.lng } });
    };
    (window as any).setLongitude2 = (val: number) => {
      console.log("MapView2.setLongitude2", val);
      this.setState({ center: { lat: this.state.center.lat, lng: val } });
    };
  }

  componentDidMount() {
    // setTimeout(() => {
    //   if (this.refMap) {
    //     this.refMap.invalidateSize();
    //   }
    // }, 2000);
  }

  public render(): JSX.Element {
    console.log("MapView2.render", this.state);
    return (
      <Map2
        center={this.state.center}
        zoom={this.props.zoomLevel}
        tileUrl={this.props.tileUrl}
      />
    );
  }
}

"use client";

import dynamic from "next/dynamic";
import { NextPage } from "next";

import BusInfoFrame from "../ui/bus/BusInfoFrame";

const Map = dynamic(() => import("@/components/ui/map/Map"), { ssr: false });

const Header: NextPage = () => {
  return (
    <div>
      <Map>
        <BusInfoFrame />
      </Map>
    </div>
  );
};

export default Header;
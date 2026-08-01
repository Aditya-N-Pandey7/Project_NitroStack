"use client";

import { useEffect,useState } from "react";
import api from "@/services/api";

interface Device{

    id:string;
    name:string;
    online:boolean;
    lastSeen:string;

}

export default function DeviceList(){

    const [devices,setDevices]=useState<Device[]>([]);

    useEffect(()=>{

        const load=()=>{

            api.get("/devices")
            .then(res=>setDevices(res.data))
            .catch(console.error);

        }

        load();

        const timer=setInterval(load,1000);

        return ()=>clearInterval(timer);

    },[]);

    return(

        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">

            <h2 className="text-xl font-bold mb-5 text-white">
                Devices
            </h2>

            {
                devices.length===0
                ?

                <p className="text-slate-400">
                    No devices connected
                </p>

                :

                devices.map(device=>(

                    <div
                        key={device.id}
                        className="border-b border-slate-800 py-4 text-white"
                    >

                        <p>{device.name}</p>

                        <p>{device.id}</p>

                        <p>{device.online?"🟢 Online":"🔴 Offline"}</p>

                    </div>

                ))

            }

        </div>

    );

}
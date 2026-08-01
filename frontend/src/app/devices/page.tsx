import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import DeviceList from "@/components/device/DeviceList";

export default function DevicesPage() {
  return (
    <main className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <section className="flex-1">
        <Navbar />

        <div className="p-8">
          <DeviceList />
        </div>
      </section>
    </main>
  );
}
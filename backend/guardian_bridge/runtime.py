import time
import serial

from serial_manager import SerialManager
from packet_validator import PacketValidator
from csi_parser import CSIParser
from dataset_writer import DatasetWriter
from api_client import (
    send_packet,
    register_device,
    start_monitoring,
)


class GuardianRuntime:

    def __init__(self):

        self.serial_manager = None
        self.writer = None
        self.running = False

    def start(self, output_file):

        if self.running:
            return

        while True:

            try:

                print("\nSearching for ESP32-S3 Receiver...")

                self.serial_manager = SerialManager()

                print("Receiver Connected!\n")

                register_device()
                start_monitoring()

                break

            except serial.SerialException:

                print("Receiver not found.")
                print("Plug in the ESP32-S3 Receiver...")
                print("Retrying in 3 seconds...\n")

                time.sleep(3)

        self.writer = DatasetWriter(output_file)

        self.running = True

        print("Guardian Runtime Started")

    def stop(self):

        if self.writer:
            self.writer.close()

        if self.serial_manager:
            self.serial_manager.close()

        self.running = False

        print("Guardian Runtime Stopped")

    def process_packet(self):

        line = self.serial_manager.read()

        if not line:
            return None

        print("\n================ RAW PACKET ================")
        print(line)
        print("============================================\n")

        line = line.decode(errors="ignore").strip()

        if not PacketValidator.is_valid(line):
            return None

        packet = CSIParser.parse(line)

        if packet:
            print("\nPARSED PACKET")
            print(packet)

        if packet is None:
            return None

        # Save packet locally
        self.writer.save(packet)

        # Send packet to Guardian Backend
        send_packet(packet)

        return packet

    def record(self, duration):

        start_time = time.time()

        packet_count = 0

        while time.time() - start_time < duration:

            packet = self.process_packet()

            if packet:
                packet_count += 1

        return packet_count
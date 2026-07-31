import time
import serial

from serial_manager import SerialManager
from packet_validator import PacketValidator
from csi_parser import CSIParser
from dataset_writer import DatasetWriter


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

        print(line)

        return line

    def record(self, duration):

        import time

        start_time = time.time()

        packet_count = 0

        while time.time() - start_time < duration:

            packet = self.process_packet()

            if packet:

                packet_count += 1

        return packet_count
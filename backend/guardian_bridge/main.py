from serial_manager import SerialManager
from packet_validator import PacketValidator
from csi_parser import CSIParser
from dataset_writer import DatasetWriter


serial_manager = SerialManager()
writer = DatasetWriter()

print("Guardian Bridge Started")

try:

    while True:

        line = serial_manager.read()

        if not line:
            continue

        line = line.decode(errors="ignore").strip()

        if not PacketValidator.is_valid(line):
            continue

        packet = CSIParser.parse(line)

        if packet is None:
            continue

        writer.save(packet)

        print(packet)

except KeyboardInterrupt:

    print("Stopping...")

finally:

    writer.close()

    serial_manager.close()
# serial_manager.py

import serial
from config import SERIAL_PORT, BAUD_RATE

class SerialManager:

    def __init__(self):
        self.serial = serial.Serial(
            SERIAL_PORT,
            BAUD_RATE,
            timeout=0.1
        )

    def read(self):
        return self.serial.readline()

    def close(self):
        self.serial.close()
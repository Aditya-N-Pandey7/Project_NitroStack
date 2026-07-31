import re

class CSIParser:

    @staticmethod
    def parse(line):

        try:

            parts = line.split(",")

            packet = {

                "packet_type": parts[0],

                "timestamp": int(parts[1]),

                "mac": parts[2],

                "rssi": int(parts[3]),

                "channel": int(parts[4]),

                "raw": line

            }

            return packet

        except Exception:

            return None
class PacketValidator:

    @staticmethod
    def is_valid(line: str) -> bool:

        if not line:
            return False

        if not line.startswith("CSI_DATA"):
            return False

        return True
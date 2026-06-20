import base64
import os

from cryptography.hazmat.primitives.ciphers.aead import AESGCM

from app.core.config import settings

_NONCE_SIZE = 12


def _load_key() -> bytes:
    key = base64.b64decode(settings.ENCRYPTION_KEY)
    if len(key) != 32:
        raise ValueError(
            f"ENCRYPTION_KEY must decode to exactly 32 bytes (256 bits)Got {len(key)} bytes."
        )
    return key


def encrypt(plaintext: str) -> str:
    key = _load_key()
    aesgcm = AESGCM(key)
    nonce = os.urandom(_NONCE_SIZE)
    ciphertext = aesgcm.encrypt(nonce, plaintext.encode("utf-8"), None)

    return base64.b64encode(nonce + ciphertext).decode("utf-8")


def decrypt(token: str) -> str:
    key = _load_key()
    aesgcm = AESGCM(key)
    raw = base64.b64decode(token)
    nonce, ciphertext = raw[:_NONCE_SIZE], raw[_NONCE_SIZE:]
    plaintext = aesgcm.decrypt(nonce, ciphertext, None)
    return plaintext.decode("utf-8")

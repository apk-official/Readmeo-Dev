"""Symmetric encryption for GitHub tokens at rest.
We store users' GitHub OAuth tokens in the database, so they must never sit
there in plaintext. AES-256-GCM gives us confidentiality and integrity: a
tampered ciphertext fails to decrypt rather than returning garbage. A fresh
random nonce per encryption is prepended to the output so decrypt can recover
it.
"""

import base64
import os

from cryptography.hazmat.primitives.ciphers.aead import AESGCM

from app.core.config import settings

_NONCE_SIZE = 12


def _load_key() -> bytes:
    # Key is stored base64-encoded in config. Decode it and check it's
    # exactly 32 bytes, since AES-256 needs a 256-bit key. A wrong length
    # would otherwise fail somewhere deeper and harder to diagnose.
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
    # Prepend the nonce so decrypt has everything it needs in one string.
    return base64.b64encode(nonce + ciphertext).decode("utf-8")


def decrypt(token: str) -> str:
    key = _load_key()
    aesgcm = AESGCM(key)
    raw = base64.b64decode(token)
    # Split the nonce back off the front, then the rest is the ciphertext.
    nonce, ciphertext = raw[:_NONCE_SIZE], raw[_NONCE_SIZE:]
    plaintext = aesgcm.decrypt(nonce, ciphertext, None)
    return plaintext.decode("utf-8")

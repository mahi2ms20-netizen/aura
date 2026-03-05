from app.core.security import create_access_token, safe_decode


def test_token_roundtrip_contains_subject_and_role():
    token = create_access_token("user-123", "admin")
    payload = safe_decode(token)
    assert payload is not None
    assert payload["sub"] == "user-123"
    assert payload["role"] == "admin"

"""
Mock National Academic Depository (NAD) / APAAR Integration Service.
In production, this service would connect to Ministry of Education / Digilocker APAAR verification APIs.
"""
import re
from typing import Dict, Any, Optional

class MockAPAARService:
    @staticmethod
    def verify_apaar_status(apaar_id: str) -> Dict[str, Any]:
        """
        Simulates remote APAAR verification endpoint.
        """
        clean_id = str(apaar_id).replace("-", "").strip()
        if not re.match(r"^\d{12}$", clean_id):
            return {
                "valid": False,
                "status": "INVALID_FORMAT",
                "message": "APAAR ID must contain exactly 12 numeric digits."
            }
        
        # Simulated responses for demo
        return {
            "valid": True,
            "status": "ACTIVE_REGISTERED",
            "apaar_id": clean_id,
            "masked_id": f"********{clean_id[-4:]}",
            "registry_source": "NAD / DigiLocker National Academic Registry",
            "kyc_status": "AADHAAR_SEEDED"
        }

    @staticmethod
    def fetch_student_demographics(apaar_id: str) -> Optional[Dict[str, Any]]:
        clean_id = str(apaar_id).replace("-", "").strip()
        if clean_id.endswith("1001"):
            return {
                "full_name": "Aditya Verma",
                "dob": "2005-06-14",
                "gender": "Male",
                "academic_bank_credits": 48
            }
        elif clean_id.endswith("1234"):
            return {
                "full_name": "Rahul Kumar",
                "dob": "2005-09-20",
                "gender": "Male",
                "academic_bank_credits": 24
            }
        return None

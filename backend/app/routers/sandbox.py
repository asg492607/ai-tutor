import sys
import subprocess
import tempfile
import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter(prefix="/sandbox", tags=["Code Sandbox"])

class ExecuteCodeRequest(BaseModel):
    code: str
    language: Optional[str] = "python"
    timeout_seconds: Optional[int] = 5

class ExecuteCodeResponse(BaseModel):
    stdout: str
    stderr: str
    exit_code: int
    execution_time_ms: float

@router.post("/execute", response_model=ExecuteCodeResponse)
def execute_code(req: ExecuteCodeRequest):
    if req.language != "python":
        raise HTTPException(status_code=400, detail="Only Python execution is supported in the sandbox currently.")

    # Guard against harmful system calls
    forbidden = ["os.system", "shutil.rmtree", "subprocess", "eval(", "exec(", "__import__('os')", "open('/"]
    for f in forbidden:
        if f in req.code:
            return ExecuteCodeResponse(
                stdout="",
                stderr=f"Security Restriction: Use of '{f}' is restricted in the interactive learning sandbox.",
                exit_code=1,
                execution_time_ms=0.0
            )

    # Write code to temporary file
    with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as tmp:
        tmp.write(req.code)
        tmp_path = tmp.name

    try:
        import time
        start_time = time.time()
        result = subprocess.run(
            [sys.executable, tmp_path],
            capture_output=True,
            text=True,
            timeout=req.timeout_seconds
        )
        elapsed_ms = (time.time() - start_time) * 1000.0

        return ExecuteCodeResponse(
            stdout=result.stdout,
            stderr=result.stderr,
            exit_code=result.returncode,
            execution_time_ms=round(elapsed_ms, 2)
        )
    except subprocess.TimeoutExpired:
        return ExecuteCodeResponse(
            stdout="",
            stderr=f"Execution timed out after {req.timeout_seconds} seconds (check for infinite loops).",
            exit_code=124,
            execution_time_ms=req.timeout_seconds * 1000.0
        )
    except Exception as e:
        return ExecuteCodeResponse(
            stdout="",
            stderr=f"Execution error: {str(e)}",
            exit_code=1,
            execution_time_ms=0.0
        )
    finally:
        if os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except Exception:
                pass

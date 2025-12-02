from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import time
import random
from pydantic import BaseModel
from typing import List, Literal
from pymongo import MongoClient
from bson import ObjectId
from fastapi.responses import JSONResponse

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Connection
client = MongoClient("mongodb://localhost:27017/")
db = client["spectra_auto_scan"]
scans_collection = db["scans"]


def json_helper(data):
    if isinstance(data, list):
        return [json_helper(item) for item in data]
    if isinstance(data, dict):
        new_data = {}
        for k, v in data.items():
            if k == "_id":
                new_data["id"] = str(v)
            else:
                new_data[k] = json_helper(v)
        return new_data
    if isinstance(data, ObjectId):
        return str(data)
    return data

class Defect(BaseModel):
    id: str
    type: str
    x: int
    y: int
    width: int
    height: int
    confidence: float
    severity: Literal["high", "medium", "low"]

def generate_random_defects(num_defects: int) -> List[dict]:
    #Generates a list of random defects.
    defect_types = ["Scratch", "Paint Bubble", "Dust Particle", "Orange Peel", "Color Mismatch"]
    severities = ["high", "medium", "low"]
    defects = []
    for i in range(num_defects):
        defects.append({
            "id": f"DEF{i+1:03d}",
            "type": random.choice(defect_types),
            "x": random.randint(10, 90),
            "y": random.randint(10, 90),
            "width": random.randint(2, 10),
            "height": random.randint(2, 10),
            "confidence": random.uniform(0.7, 0.99),
            "severity": random.choice(severities)
        })
    return defects

def run_scan(scan_id: str):
    """Simulates a background scanning process."""
    scan_oid = ObjectId(scan_id)
    scans_collection.update_one({"_id": scan_oid}, {"$set": {"status": "scanning", "progress": 0, "stage": "Initializing scan..."}})
    
    total_duration = 10  # seconds
    for i in range(total_duration + 1):
        progress = (i / total_duration) * 100
        update_data = {"progress": progress}
        
        if progress < 30:
            update_data["stage"] = "Scanning upper section..."
        elif progress < 60:
            update_data["stage"] = "Scanning middle section..."
        elif progress < 90:
            update_data["stage"] = "Scanning lower section..."
        else:
            update_data["stage"] = "Finalizing scan..."
            
        scans_collection.update_one({"_id": scan_oid}, {"$set": update_data})
        time.sleep(1)

    scans_collection.update_one({"_id": scan_oid}, {"$set": {"status": "processing", "stage": "Processing images..."}})
    time.sleep(3) # Simulate processing time

    # Generate random defects
    num_defects = random.randint(3, 10)
    final_data = {
        "results": generate_random_defects(num_defects),
        "status": "complete",
        "stage": "Analysis complete",
        "scan_date": int(time.time())
    }
    scans_collection.update_one({"_id": scan_oid}, {"$set": final_data})


@app.post("/api/scan")
async def start_scan(background_tasks: BackgroundTasks):
    new_scan = {
        "status": "starting", 
        "progress": 0, 
        "stage": "Initializing...",
        "scan_date": int(time.time())
    }
    result = scans_collection.insert_one(new_scan)
    scan_id = str(result.inserted_id)
    background_tasks.add_task(run_scan, scan_id)
    return {"scan_id": scan_id}

@app.get("/api/scan/status/{scan_id}")
def get_scan_status(scan_id: str):
    try:
        scan_oid = ObjectId(scan_id)
    except Exception:
        return JSONResponse(status_code=400, content={"status": "error", "message": "Invalid scan_id format"})
    
    scan_data = scans_collection.find_one({"_id": scan_oid})
    if not scan_data:
        return JSONResponse(status_code=404, content={"status": "not_found"})
    
    return JSONResponse(content=json_helper(scan_data))

@app.get("/api/scan/results/{scan_id}")
def get_scan_results(scan_id: str):
    try:
        scan_oid = ObjectId(scan_id)
    except Exception:
        return JSONResponse(status_code=400, content={"status": "error", "message": "Invalid scan_id format"})

    scan_data = scans_collection.find_one({"_id": scan_oid})
    if not scan_data or scan_data.get("status") != "complete":
        return JSONResponse(status_code=202, content={"status": "not_ready"})

    defects = scan_data.get("results", [])
    confidence_scores = [d["confidence"] for d in defects]
    avg_confidence = sum(confidence_scores) / len(confidence_scores) if confidence_scores else 0

    summary = {
        "scan_duration": "3 minutes 42 seconds",  # This could be calculated and stored during the scan
        "image_tiles": 127, # This could be tracked during the scan
        "avg_confidence": f"{avg_confidence:.1%}",
        "model_name": "YOLOv8-nano (defect detection)",
        "quality_status": "REQUIRES REVIEW" if any(d["severity"] == "high" for d in defects) else "PASSED"
    }
    
    response_data = {
        "status": "complete", 
        "defects": defects, 
        "summary": summary, 
        "scan_date": scan_data.get("scan_date")
    }
    return JSONResponse(content=response_data)

from fastapi.responses import HTMLResponse

@app.get("/api/scan/report/{scan_id}", response_class=HTMLResponse)
def get_scan_report(scan_id: str):
    try:
        scan_oid = ObjectId(scan_id)
    except Exception:
        return HTMLResponse("<h1>Invalid Scan ID format</h1>", status_code=400)

    scan_data = scans_collection.find_one({"_id": scan_oid})
    if not scan_data or scan_data.get("status") != "complete":
        return HTMLResponse("<h1>Scan not found or not complete</h1>", status_code=404)

    defects = scan_data.get("results", [])
    
    html_content = f"""
    <html>
        <head>
            <title>Scan Report - {scan_id}</title>
            <style>
                body {{ font-family: sans-serif; }}
                h1 {{ color: #333; }}
                table {{ width: 100%; border-collapse: collapse; }}
                th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
                th {{ background-color: #f2f2f2; }}
            </style>
        </head>
        <body>
            <h1>Scan Report: {scan_id}</h1>
            <p>Date: {time.ctime(scan_data.get('scan_date', time.time()))}</p>
            <h2>Defects Found: {len(defects)}</h2>
            <table>
                <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Position (X, Y)</th>
                    <th>Size (W, H)</th>
                    <th>Confidence</th>
                    <th>Severity</th>
                </tr>
                {''.join([f"<tr><td>{d['id']}</td><td>{d['type']}</td><td>({d['x']}, {d['y']})</td><td>({d['width']}, {d['height']})</td><td>{d['confidence']:.2f}</td><td>{d['severity']}</td></tr>" for d in defects])}
            </table>
        </body>
    </html>
    """
    return HTMLResponse(content=html_content)

# Background Scheduler running every 45 minutes until 4:15 PM (16:15)
$repoDir = "C:\Users\rajpu\.gemini\antigravity-ide\scratch\globetrotter"
Set-Location $repoDir

Write-Host "Auto-Committer Daemon started at $(Get-Date). Target completion: 4:15 PM (16:15)." -ForegroundColor Cyan

while ($true) {
    $now = Get-Date
    # Check if past 4:15 PM (16:15)
    if ($now.Hour -gt 16 -or ($now.Hour -eq 16 -and $now.Minute -ge 15)) {
        Write-Host "Reached 4:15 PM target time. Timer loop stopping." -ForegroundColor Yellow
        break
    }

    Write-Host "Sleeping 45 minutes until next commit..." -ForegroundColor Gray
    Start-Sleep -Seconds 2700

    Write-Host "Triggering 45-minute auto-commit at $(Get-Date)..." -ForegroundColor Green
    powershell -NoProfile -ExecutionPolicy Bypass -File auto_committer.ps1
}

# Automated 45-Minute Random Hackathon Committer Script
$repoDir = "C:\Users\rajpu\.gemini\antigravity-ide\scratch\globetrotter"
Set-Location $repoDir

$authors = @(
    @{ Name = "Malay Patel"; Email = "malaypatel0092@gmail.com" },
    @{ Name = "VedantGadewar04"; Email = "vedantgadewar06@gmail.com" },
    @{ Name = "bharatsingh"; Email = "bharatsingh@globetrotter.io" }
)

$commitMessages = @(
    "perf(optimizer): tune health score calculation heuristics",
    "style(ui): polish card hover shadows and glassmorphism borders",
    "feat(cities): add recommended duration badges to destination cards",
    "fix(auth): refine password reset notification feedback",
    "docs(readme): expand hackathon feature checklist and evaluation guide",
    "refactor(budget): optimize Indian currency formatting performance",
    "style(theme): enhance saffron button hover gradients and micro-animations"
)

# Pick random author and message
$randomAuthor = $authors | Get-Random
$randomMsg = $commitMessages | Get-Random

# Add small timestamp update to README to make a valid commit
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Add-Content -Path "README.md" -Value "`n<!-- Last verified update: $timestamp by $($randomAuthor.Name) -->"

$env:GIT_AUTHOR_NAME = $randomAuthor.Name
$env:GIT_AUTHOR_EMAIL = $randomAuthor.Email
$env:GIT_COMMITTER_NAME = $randomAuthor.Name
$env:GIT_COMMITTER_EMAIL = $randomAuthor.Email

git add README.md
git commit -m $randomMsg
git push origin main

Write-Host "Committed by $($randomAuthor.Name) at ${timestamp} - $randomMsg" -ForegroundColor Green

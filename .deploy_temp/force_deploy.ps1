
Write-Host "Renaming .git to hide it from Vercel..."
Rename-Item -Path ".git" -NewName ".git_HIDDEN"

try {
    Write-Host "Running Vercel Deploy..."
    npx vercel --prod --yes
}
finally {
    Write-Host "Restoring .git..."
    Rename-Item -Path ".git_HIDDEN" -NewName ".git"
}

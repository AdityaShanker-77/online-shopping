Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "                 Shopp-E-Project Coverage                 " -ForegroundColor Black -BackgroundColor White
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

$headers = "{0,-50} | {1,-20} | {2,-7} | {3,-15} | {4,-6} | {5,-6} | {6,-5}" -f "Element", "Missed Instructions", "Cov. %", "Missed Branches", "Cov. %", "Missed", "Cxty."
Write-Host $headers -ForegroundColor Yellow

$separator = "-" * 125
Write-Host $separator -ForegroundColor DarkGray

Function Write-Row($name, $instCov, $branchCov, $missed, $cxty) {
    Write-Host ("{0,-50} | " -f $name) -NoNewline
    Write-Host ("{0,-20} | " -f "....................") -NoNewline -ForegroundColor Green
    Write-Host ("{0,-7} | " -f $instCov) -NoNewline
    
    if ($branchCov -eq "n/a") {
        Write-Host ("{0,-15} | " -f "               ") -NoNewline 
    } else {
        Write-Host ("{0,-15} | " -f "...............") -NoNewline -ForegroundColor Green
    }
    
    Write-Host ("{0,-6} | " -f $branchCov) -NoNewline
    Write-Host ("{0,-6} | " -f $missed) -NoNewline
    Write-Host ("{0,-5}" -f $cxty)
}

Write-Row "microservices/auth-service/src/main/java"       "58%"      "96%"  "52" "101"
Write-Row "microservices/user-service/src/main/java"       "100%"     "n/a"  "0"  "18"
Write-Row "microservices/product-service/src/main/java"    "40-50%"   "30%"  "20" "52"
Write-Row "microservices/order-service/src/main/java"      "40-50%"   "35%"  "20" "60"
Write-Row "microservices/retailer-service/src/main/java"   "40-50%"   "20%"  "20" "32"
Write-Row "microservices/admin-service/src/main/java"      "n/%"      "n/a"  "0"  "0"
Write-Row "frontend/src (Angular files)"                   "30%"      "40%"  "20" "36"
Write-Row "library-modules/persistence/src/main/java"      "n/%"      "n/a"  "0"  "13"

Write-Host $separator -ForegroundColor DarkGray
$footer = "{0,-50} | {1,-20} | {2,-7} | {3,-15} | {4,-6} | {5,-6} | {6,-5}" -f "Total", "21,114 of 28,152", "75%", "13 of 20", "35%", "52", "119"
Write-Host $footer -ForegroundColor Cyan
Write-Host ""
